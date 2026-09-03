/**
 * straylight.folia.app as a Worker.
 *
 *   /api/*  -> /.netlify/functions/:splat   (only boardimg exists)
 *   /*      -> /index.html (200)
 *   Permissions-Policy: interest-cohort=() on this site's own assets
 *
 * boardimg is imported rather than reimplemented: it renders the og:image for
 * every board, and the bytes it returns are what link previews cached.
 */
import { handler as boardimg } from '../../functions/boardimg'
import { runNetlifyFunction } from './netlify'

const FUNCTIONS = { boardimg }
const HEADERS = { 'Permissions-Policy': 'interest-cohort=()' }

export default {
  async fetch (request, env) {
    const url = new URL(request.url)

    // Both prefixes reach the same functions. /api/ is the redirect declared
    // in netlify.toml; /.netlify/functions/ is the path Netlify also serves
    // implicitly, and it is the one baked into published urls -- so it has
    // to answer too. Only the declared redirect was ported originally,
    // which left those published urls returning the SPA shell.
    const PREFIXES = ['/api/', '/.netlify/functions/']
    const prefix = PREFIXES.find(p => url.pathname.startsWith(p))
    if (prefix) {
      const rest = url.pathname.slice(prefix.length)
      const name = rest.split('/')[0]
      const fn = FUNCTIONS[name]
      if (!fn) return new Response('Not Found', { status: 404 })
      // The function reads chainId and boardId off the tail of event.path, so
      // it must see the path Netlify gave it: /.netlify/functions/<splat>.
      return runNetlifyFunction(fn, request, { path: '/.netlify/functions/' + rest })
    }

    let res = await asset(env, request, url.pathname)
    if (res.status === 404 && url.pathname.endsWith('/')) {
      const idx = await asset(env, request, url.pathname + 'index.html')
      if (idx.status !== 404) res = idx
    }
    if (res.status === 404) {
      const index = await asset(env, request, '/index.html')
      if (index.status !== 404) res = new Response(index.body, { status: 200, headers: index.headers })
    }
    const out = new Response(res.body, res)
    for (const [k, v] of Object.entries(HEADERS)) out.headers.set(k, v)
    return out
  }
}

function asset (env, request, pathname) {
  const u = new URL(request.url)
  u.pathname = pathname
  u.search = ''
  return env.ASSETS.fetch(new Request(u, { method: request.method, headers: request.headers }))
}
