import { ethers } from 'ethers'


/**
 * A provider that spreads load, limits concurrency, and backs off.
 *
 * The first version of this pointed every read at one free gateway with no
 * throttle. That works until a page renders a hundred owner addresses: each
 * Addr component resolves ENS, reverse resolution is roughly four calls, and the
 * page fires four hundred requests in a burst. Free gateways rate-limit per IP
 * over a time window, so the burst earns 429s, the queries throw, and the grid
 * empties — the same symptom as the bug this was meant to fix, from the
 * opposite cause.
 *
 * So three things, all at the transport layer where every existing call site
 * gets them for free:
 *
 *   - requests round-robin across the pool instead of hammering one host
 *   - a semaphore caps how many are in flight at once
 *   - 429 and 5xx retry with exponential backoff and jitter, moving to the next
 *     endpoint each attempt
 */
/*
 * StaticJsonRpcProvider, not JsonRpcProvider, and the difference is large.
 *
 * Plain JsonRpcProvider re-runs network detection constantly: measured over
 * five ENS reverse lookups it sent 21 eth_chainId calls out of 34 requests
 * total. The chain id of an endpoint pinned to mainnet cannot change, which is
 * exactly the case StaticJsonRpcProvider exists for -- the same five lookups
 * then cost 1 eth_chainId out of 14 requests, and finished in 1.4s instead of
 * 3.0s, with identical results.
 *
 * On the coordinates grid that overhead was 99 of 220 requests on a single
 * page load: nearly half the traffic spent asking six endpoints, over and
 * over, which chain they were.
 */
class PooledProvider extends ethers.providers.StaticJsonRpcProvider {
  constructor (urls, { concurrency = 4, retries = 4 } = {}) {
    super(urls[0])
    this._urls = urls.slice()
    this._cursor = 0
    this._maxInFlight = concurrency
    this._inFlight = 0
    this._waiting = []
    this._retries = retries
    this._id = 0
  }

  _next () {
    const u = this._urls[this._cursor % this._urls.length]
    this._cursor++
    return u
  }

  async _acquire () {
    if (this._inFlight < this._maxInFlight) { this._inFlight++; return }
    await new Promise((resolve) => this._waiting.push(resolve))
    this._inFlight++
  }

  _release () {
    this._inFlight--
    const next = this._waiting.shift()
    if (next) next()
  }

  async send (method, params) {
    // super() kicks off ethers' network detection, and that calls send() before
    // the subclass fields below exist. In node the timing hid it; in a browser
    // it left the provider dead and the page silently empty. Fall back to plain
    // behaviour until the pool is initialised.
    if (!this._urls) return super.send(method, params)
    await this._acquire()
    try {
      let lastErr
      for (let attempt = 0; attempt <= this._retries; attempt++) {
        const url = this._next()
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', id: ++this._id, method, params })
          })
          if (res.status === 429 || res.status >= 500) {
            lastErr = new Error(`${res.status} from ${url}`)
          } else {
            const json = await res.json()
            if (json.error) {
              // A real rpc error — wrong args, unsupported method, range too
              // wide. Retrying will not change the answer, so surface it.
              const e = new Error(json.error.message || 'rpc error')
              e.code = json.error.code
              throw e
            }
            return json.result
          }
        } catch (e) {
          if (e && e.code !== undefined) throw e   // genuine rpc error
          lastErr = e
        }
        // backoff with jitter; every attempt also moves to the next endpoint
        const wait = Math.min(2000, 150 * 2 ** attempt) + Math.random() * 120
        await new Promise((resolve) => setTimeout(resolve, wait))
      }
      throw lastErr || new Error('all endpoints failed')
    } finally {
      this._release()
    }
  }
}


/**
 * Redundant, keyless RPC access, per chain.
 *
 * Every endpoint here is free, needs no account, and answers CORS preflights, so
 * it works from a browser. Order is preference; each is a fallback for the one
 * before it. Benchmarked across sixteen mainnet and five Optimism candidates.
 *
 * The reason this exists: one provider's eth_getLogs cap silently broke four
 * things across these repos — a mint listener that rendered no artwork for two
 * years, two token grids, and a metadata field that published "-" for 101
 * tokens. Each failed into a plausible fallback rather than an error. A single
 * provider is what made that possible.
 */
export const RPCS_BY_CHAIN = {
  1: [
    'https://gateway.tenderly.co/public/mainnet',
    'https://mainnet.gateway.tenderly.co',
    'https://eth.drpc.org',
    'https://rpc.mevblocker.io',
    'https://ethereum-rpc.publicnode.com',
    'https://eth-mainnet.public.blastapi.io'
  ],
  10: [
    'https://optimism.gateway.tenderly.co',
    'https://optimism.drpc.org',
    'https://optimism-rpc.publicnode.com',
    'https://mainnet.optimism.io'
  ],
  // Goerli and Optimism Goerli are shut down. Kept so a chain id lookup does not
  // return undefined; nothing should be reading them.
  5: ['https://eth-goerli.public.blastapi.io'],
  420: ['https://optimism-goerli.public.blastapi.io']
}

const override = () => {
  const raw = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_APP_RPCS) || ''
  return raw ? String(raw).split(',').map((s) => s.trim()).filter(Boolean) : null
}

const listFor = (chainId) => RPCS_BY_CHAIN[chainId] || RPCS_BY_CHAIN[1]

/**
 * Tenderly is the scarce resource, so ordinary traffic is kept off it.
 *
 * Measured against the straylight mainnet contract: every endpoint here serves
 * eth_call happily, but only the two Tenderly ones will serve a log query over
 * the full ~9.8M block range since deploy -- drpc, mevblocker, publicnode and
 * blastapi all refuse it. Spending Tenderly's rate limit on eth_call therefore
 * costs the one thing that can answer the query that matters, and the symptom
 * was a wall of 429s and a Worlds list stuck on "loading...".
 *
 * So the two orderings are deliberately different: ordinary reads try the
 * plentiful endpoints first and fall back to Tenderly, while log scans go
 * straight to the only endpoints that can serve them.
 */
const isTenderly = (u) => u.includes('tenderly')

export const rpcsFor = (chainId = 1) => {
  const o = override()
  if (o) return o
  const all = listFor(chainId)
  return [...all.filter((u) => !isTenderly(u)), ...all.filter(isTenderly)]
}

/** Endpoints that will serve a whole-history log range, best first. */
export const logRpcsFor = (chainId = 1) => override() || listFor(chainId)

export const providersFor = (chainId = 1) =>
  rpcsFor(chainId).map((u) => new ethers.providers.JsonRpcProvider(u))

/** A read provider for ordinary calls. */
export const readProvider = (chainId = 1) => new PooledProvider(rpcsFor(chainId))

/** Run fn against each endpoint for the chain until one answers. */
export async function anyOf (fn, chainId = 1) {
  let last
  for (const p of providersFor(chainId)) {
    try { return await fn(p) } catch (e) { last = e }
  }
  throw last || new Error('no RPC endpoint answered')
}

/** A rate-limit response, as opposed to a refusal to serve the range. */
const isRateLimit = (e) => {
  const m = `${e && e.message} ${e && e.body} ${e && e.status}`.toLowerCase()
  return m.includes('429') || m.includes('rate limit') || m.includes('too many requests')
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Whole-range logs, from whichever endpoint will serve them.
 *
 * Two failures look alike here and must not be treated alike. An endpoint that
 * caps ranges ("ranges over 10000 blocks are not supported") will never serve
 * this query, so moving on is right. An endpoint answering 429 would serve it
 * given a moment, and moving on is exactly wrong -- measured against the
 * straylight mainnet contract, only the two Tenderly endpoints accept the full
 * ~9.8M block range at all; the other four refuse it outright. So a 429 on
 * Tenderly followed by "try the next one" means the query cannot succeed,
 * which is what left the Worlds list on "loading..." indefinitely.
 *
 * Hence: back off and retry the same endpoint on 429, and only move to the
 * next endpoint when this one has actually refused the work.
 */
export async function getAllLogs (address, abi, filterName, chainId = 1, fromBlock = 0, attempts = 4) {
  const errors = []
  for (const url of logRpcsFor(chainId)) {
    const p = new PooledProvider([url], { concurrency: 2 })
    const c = new ethers.Contract(address, abi, p)
    for (let i = 0; i < attempts; i++) {
      try {
        const logs = await c.queryFilter(c.filters[filterName](), fromBlock)
        return { logs, via: url, mode: 'wide' }
      } catch (e) {
        if (isRateLimit(e) && i < attempts - 1) {
          await sleep(600 * Math.pow(2, i) + Math.random() * 400)
          continue
        }
        errors.push(`${url}: ${String(e && e.message).slice(0, 60)}`)
        break
      }
    }
  }
  throw new Error('no endpoint served the full log range — ' + errors.slice(0, 2).join(' | '))
}

/** Current holders via ERC721Enumerable — plain eth_call work every endpoint serves. */
/** Not every ERC721 implements Enumerable; calling tokenByIndex on one that
 *  does not throws, which is how this fallback managed to break a listing it
 *  was written to rescue. shaDoAW is such a contract. */
export const canEnumerate = (abi) =>
  abi.some((x) => x.type === 'function' && x.name === 'tokenByIndex') &&
  abi.some((x) => x.type === 'function' && x.name === 'totalSupply')

export async function enumerateOwners (address, abi, chainId = 1, batch = 25) {
  // Through the pool, not a raw endpoint: two calls per token means a few
  // hundred for a full collection, and unthrottled that is an instant 429.
  const run = async (p) => {
    const c = new ethers.Contract(address, abi, p)
    const total = (await c.totalSupply()).toNumber()
    const ids = []
    for (let i = 0; i < total; i += batch) {
      ids.push(...(await Promise.all(
        Array.from({ length: Math.min(batch, total - i) }, (_, k) => c.tokenByIndex(i + k))
      )))
    }
    const out = []
    for (let i = 0; i < ids.length; i += batch) {
      const owners = await Promise.all(ids.slice(i, i + batch).map((id) => c.ownerOf(id)))
      owners.forEach((owner, k) => out.push({ tokenId: ids[i + k], owner }))
    }
    return out
  }
  return run(readProvider(chainId))
}

/**
 * Transfer events, or something a listing can treat as them.
 *
 * `mode` is 'logs' for real history, 'owners' for a synthesised set built from
 * current holders. A listing reaches the same state either way, because the
 * only thing it takes from a transfer is who holds the token now. Anything
 * wanting previous owners, ordering or timestamps must check `mode` — the
 * synthesised set has none of those and would otherwise read as "every token
 * minted once to its current owner and never moved".
 */
export async function getTransferEvents (address, abi, chainId = 1, fromBlock = 0) {
  try {
    const { logs, via } = await getAllLogs(address, abi, 'Transfer', chainId, fromBlock)
    return { events: logs, via, mode: 'logs' }
  } catch (logError) {
    // No enumeration available: re-throw rather than return an empty list that
    // looks like "this collection has no tokens".
    if (!canEnumerate(abi)) throw logError
    const holders = await enumerateOwners(address, abi, chainId)
    return {
      events: holders.map(({ tokenId, owner }) => ({
        args: [ethers.constants.AddressZero, owner, tokenId]
      })),
      via: 'enumeration',
      mode: 'owners',
      logError: logError.message
    }
  }
}
