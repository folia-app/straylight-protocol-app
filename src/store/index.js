import { createStore } from 'vuex'
// contracts
import NFTContract from '../../contracts/Straylight.js'
import Controller from '../../contracts/Minting.js'
// web3
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
// Wallet Connect - directly import .js file since import breaks `vite build`
// see: https://github.com/vitejs/vite/issues/7257
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'

let provider, signer, walletProvider, initializing, nftContract, controllerContract

const infuraProjectID = import.meta.env.VITE_APP_INFURA_PROJECT_ID

const networks = {
  1: { name: 'mainnet', layer: 'ethereum', infura: `https://mainnet.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://etherscan.io' } },
  // 4: { name: 'rinkeby', layer: 'ethereum', infura: `https://rinkeby.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://rinkeby.etherscan.io' } }
  69: { name: 'kovan', layer: 'optimism', infura: null, explorer: { name: 'Etherscan', domain: 'https://kovan-optimistic.etherscan.io/' } },
  420: { name: 'goerli', layer: 'optimism', infura: `https://optimism-goerli.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://blockscout.com/optimism/goerli' } },
}
const appNetworkId = import.meta.env.VITE_APP_FALLBACK_NETWORK_ID || 1

// setup web3 modal
// let web3Modal = {}
const web3Modal = new Web3Modal({
  // network: deployNetwork.name, // optional - NOTE, doesn't seem to work with "polygon" as name...
  cacheProvider: true, // optional
  providerOptions: { // required
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraProjectID, // required
        // rpc: {
        //   137: networks[137].infura,
        // }
      },
    }
  },
  theme: 'dark'
})

export default createStore({
  // modules: { profiles },
  state () {
    return {
      address: null,
      networkId: null, // wallet network
      appNetworkId,

      contractAddr: null,

      mintPrice: undefined,
      collectionsList: undefined,

      mints: null,
      mintCount: undefined,
      tokens: [],

      moves: undefined,

      // old
      reserveAuctionContract: null,

      works: [],
      metadatas: [],
      addresses: {},
    }
  },
  getters: {
    network: (state) => networks[state.networkId],
    // weiToETH: () => (wei) => web3?.utils.fromWei(wei) ?? '-',
    weiToETH: () => wei => ethers.utils.formatUnits(wei) ?? '...',
    // ethToWei: () => (eth) => web3?.utils.toWei(eth) ?? '-',
    ethToWei: () => (eth) => ethers.utils.parseUnits(eth).toString() ?? '-',
    workId: () => (uid, prefix) => {
      const id = Number(uid) // / 1000000
      return prefix ? ('00' + id).slice(-3) // 001
        : id // 1 - for contract communication
    },
    addrShort: () => (addr) => addr ? addr.slice(0, 6) + '...' + addr.slice(-4) : '...',
    userBalance: (state) => (addr) => provider?.getBalance(addr || state.address) || '0', // wei
    isSoldOut: () => (work) => {
      return work && Number(work.editions) && Number(work.printed) >= Number(work.editions)
    },
    isConnectedAddr: (state) => (addr) => addr && addr.toLowerCase() === state.address,
    openSeaLink: (state, getters) => ({ token, account }) => {
      const isTestnet = [4].includes(state.networkId)
      const path = token ? `/assets/${state.contractAddr}/${token}`
        : account ? `/accounts/${account}`
          : ''
      return `https://${isTestnet ? 'testnets.' : ''}opensea.io` + path
    },
    meta: state => ({ title, descrip, img }) => {
      const meta = []
      // defaults
      const siteTitle = 'Decomposer'
      const siteDescrip = 'An interactive NFT collection by artist Oliver Laric, where collectors "decompose" NFTs from their own collection ~ presented by folia.app'
      const siteImg = window.location.origin + '/promo/decomposer-diagram.png'
      // custom
      title = title ? `${title}` : siteTitle
      descrip = descrip || siteDescrip
      img = img || siteImg
      // add
      meta.push({ property: 'og:title', content: title })
      meta.push({ property: 'og:site_name', content: siteTitle })
      meta.push({ property: 'og:type', content: 'website' })
      meta.push({ name: 'description', content: descrip })
      meta.push({ property: 'og:description', content: descrip })
      meta.push({ property: 'og:image', content: img })
      // twitter?
      meta.push({ name: 'twitter:card', content: 'summary_large_image' })
      meta.push({ name: 'twitter:domain', content: 'folia.app' })
      // meta.push({ property: 'og:url', content: ##ADDCANNONICAL## })
      return meta
    },
  },
  mutations: {
    SIGN_IN (state, address) {
      state.address = address.toLowerCase()
    },
    SIGN_OUT (state) {
      state.address = null
    },
    SET_NETWORK (state, id) {
      state.networkId = id
    },
    SET_NETWORK_ID (state, id) {
      state.networkId = id
      console.log('network:', id)
    },
    SAVE_WORK (state, work) {
      const i = state.works.findIndex(svd => svd.id === work.id)
      // remove existing ?
      if (i > -1) state.works.splice(i, 1)
      // push so app updates
      state.works.push(work)
    },
    SAVE_TOKEN (state, token) {
      state.tokens.push(token) // [tokenId, ownerAddr]
    },
    SAVE_METADATA (state, metadata) {
      state.metadatas.push(metadata)
    },

    SET_CONTRACTS (state, { chainId, provider }) {
      if (!networks[chainId]) {
        console.warn(`Unsupported network: (id: ${chainId}). Default will be used for contracts (id: ${appNetworkId})`)
        chainId = appNetworkId
      }
      // nft
      nftContract = new ethers.Contract(NFTContract.networks[chainId].address, NFTContract.abi, provider)
      state.contractAddr = NFTContract.networks[chainId].address.toLowerCase()
      console.log('token:', NFTContract.networks[chainId].address)

      // controller
      controllerContract = new ethers.Contract(Controller.networks[chainId].address, Controller.abi, provider)
      console.log('controller:', Controller.networks[chainId].address)
    },

    SAVE_ADDRESS (state, { address, ens, openSea }) {
      const addrs = JSON.parse(JSON.stringify(state.addresses))
      addrs[address.toLowerCase()] = { ens, openSea }
      state.addresses = addrs
    },

    SET_MINT_PRICE (state, bigNumber) {
      state.mintPrice = bigNumber
    },

    SAVE_COLLECTIONS_LIST (state, contracts) {
      state.collectionsList = contracts
    },

    SAVE_MINTS (state, mints) {
      state.mints = mints
    },

    SET_MINT_COUNT (state, count) {
      state.mintCount = count
    },

    SAVE_MOVES (state, moves) {
      state.moves = moves
    }
  },
  actions: {
    // setup provider -> network/contracts
    async init ({ state, commit, dispatch }) {
      // de-dupe
      if (initializing) {
        return initializing
      }

      const setup = async () => {
        try {
          // auto-connect?
          if (web3Modal.cachedProvider) {
            await dispatch('connect')
          }

          // fallback provider
          if (!provider) {
            await dispatch('setupFallbackProvider')
          }

          initializing = false
        } catch (e) {
          console.error('@init', e)
          initializing = false
          throw e
        }
      }

      // create a promise for the handler
      initializing = new Promise((resolve, reject) => setup().then(resolve).catch(reject))

      return initializing
    },

    async setupFallbackProvider ({ dispatch }) {
      try {
        if (window.ethereum) {
          // metamask/browser
          provider = new ethers.providers.Web3Provider(window.ethereum)
        } else {
          // infura fallback
          console.log(appNetworkId)
          provider = new ethers.getDefaultProvider(networks[appNetworkId].infura)
        }

        await dispatch('getNetwork', provider)

        return true
      } catch (e) {
        console.error(e)
      }
    },

    // getNetworkId ({ commit }, provider) {
    //   return provider.getNetwork()
    //     .then(network => commit('SET_NETWORK_ID', network.chainId))
    //     .catch(console.error)
    // },

    async getNetwork ({ commit }, provider) {
      try {
        const { chainId } = await provider.getNetwork()
        // set network
        commit('SET_NETWORK_ID', chainId)
        // set contracts
        commit('SET_CONTRACTS', { chainId, provider })

        return chainId
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    /* connect wallet */
    async connect ({ state, commit, dispatch }) {
      try {
        // connect and update provider, signer
        walletProvider = await web3Modal.connect()
        provider = new ethers.providers.Web3Provider(walletProvider)
        signer = provider.getSigner()

        // set user address
        const address = await signer.getAddress()
        commit('SIGN_IN', address)

        // set network id
        await dispatch('getNetwork', provider)

        // commit('SET_CONTRACTS', provider)

        dispatch('listenToWalletProvider')
        return
      } catch (e) {
        // clear wallet in case
        dispatch('disconnect')
        // throw error so stops any flows (closes modal too)
        throw e
      }
    },

    /* disconnect wallet */
    disconnect ({ commit, dispatch }) {
      // clear so they can re-select from scratch
      web3Modal.clearCachedProvider()
      // manually clear walletconnect --- https://github.com/Web3Modal/web3modal/issues/354
      localStorage.removeItem('walletconnect')

      // if (walletProvider.off) {
      //   walletProvider.off('accountsChanged')
      //   walletProvider.off('disconnect')
      // }

      commit('SIGN_OUT')
      dispatch('setupFallbackProvider')
      signer = null
    },

    /* wallet events */
    listenToWalletProvider ({ commit, dispatch }) {
      if (!walletProvider?.on) return

      // account changed (or disconnected)
      walletProvider.on('accountsChanged', accounts => {
        console.log('accountsChanged', accounts)
        if (!accounts.length) {
          return dispatch('disconnect')
        }
        commit('SIGN_IN', accounts[0])
      })

      // changed network
      walletProvider.on('chainChanged', chainId => {
        console.log('network changed', chainId)
        // reload page so data is correct...
        window.location.reload()
      })

      // random disconnection? (doesn't fire on account disconnect)
      walletProvider.on('disconnect', error => {
        console.error('disconnected?', error)
        dispatch('disconnect')
      })
    },

    async getNFTContract ({ dispatch }) {
      try {
        if (!nftContract) await dispatch('init')
        return nftContract
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getControllerDeployBlock ({ state, dispatch }) {
      let block = networks[state.networkId].controllerDeployBlock
      if (!block) {
        try {
          if (!provider) await dispatch('init')
          // get block from deploy tx
          block = (await provider.getTransaction(Controller.networks[state.networkId].transactionHash)).blockNumber
          // save to networks object
          networks[state.networkId].controllerDeployBlock = block
        } catch (e) {
          console.error("Couldn't get deploy block: " + e)
          block = null
        }
      }
      return block
    },

    async getBoardCount ({ state, dispatch }) {
      try {
        if (!nftContract) await dispatch('init')
        const count = await nftContract.boardcounter() // starts at 0
        return count.add(1).toNumber()
      } catch (e) {
        console.error(e)
      }
    },
    
    async getBoardImage ({ state, dispatch }, { id }) {
      try {
        if (!nftContract) await dispatch('init')
        return nftContract.renderBoard(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMintedEvents ({ state, dispatch }) {
      try {
        if (!controllerContract) await dispatch('init')

        // TODO fix from block
        const fromBlock = await dispatch('getControllerDeployBlock')

        // get events...
        // console.time('getEvents')
        const mintEvents = await nftContract.queryFilter('turmiteMint', fromBlock)
        // console.timeEnd('getEvents')

        return mintEvents
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMints ({ state, commit, dispatch }, { cached = false }) {
      try {
        if (cached && state.mints) {
          return state.mints
        }
        // get all mint events...
        const events = await dispatch('getMintedEvents')
        console.log({ events })
        
        // format
        const mints = events.reverse().map(event => ({
          blockNumber: event.blockNumber,
          tokenId: event.args[0].toString().toLowerCase(),
          rule: event.args[1].toString().toLowerCase()
        }))
        console.log({ mints })
        
        commit('SAVE_MINTS', mints)
        return mints
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async findMint ({ dispatch }, { contract, tokenId }) {
      try {
        const events = await dispatch('getMintedEvents')
        // find mint event by matching contract and token id
        return events.find(event => {
          return event.args.contractAddress.toString().toLowerCase() === contract.toLowerCase() &&
            event.args.tokenId.toString().toLowerCase() === tokenId.toLowerCase()
        })
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMintPrice ({ state, commit, dispatch }) {
      try {
        // saved?
        if (state.mintPrice) return state.mintPrice
        //
        if (!controllerContract) await dispatch('init')
        // fetch...
        const price = await controllerContract.mintPrice()
        // save
        commit('SET_MINT_PRICE', price)
        return price
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMoves ({ state, commit, dispatch }, { cached = false, filter }) {
      try {
        let moves = cached && state.moves ? state.moves : null
        
        if (!moves) {
          if (!nftContract) await dispatch('init')

          // TODO fix from block
          const fromBlock = 0 // await dispatch('getControllerDeployBlock')
          
          // get events...
          const events = await nftContract.queryFilter('turmiteMove', fromBlock)
          console.log({ moveEvents: events })

          // format
          moves = events.reverse().map(event => ({
            type: 'move',
            blockNumber: event.blockNumber,
            boardId: event.args[1].toString(),
            tokenId: event.args[0].toString().toLowerCase(),
            getReceipt: event.getTransactionReceipt,
            getBlock: event.getBlock,
          }))
          console.log({ moves })
          
          commit('SAVE_MOVES', moves)
        }

        // filter?
        if (filter) {
          console.log(filter, { moves })
          moves = moves.filter(event => event[filter[0]] === filter[1])
          console.log('fitlered', { moves })
        }

        return moves
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMintCount ({ state, commit, dispatch }) {
      try {
        if (!nftContract) await dispatch('init')
        const count = await nftContract.totalSupply()
        commit('SET_MINT_COUNT', count)
        return count
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async listenForMints ({ state, dispatch }) {
      try {
        if (!controllerContract) await dispatch('init')
        // TODO - cancel if sold out?
        controllerContract.on('editionBought', (contractAddress, tokenId, newTokenId) => {
          console.log('new mint!', { contractAddress, tokenId, newTokenId })
          dispatch('getMintCount')
          dispatch('getMints', {})
        })
        console.log('listening for mints...')
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async mint ({ state, dispatch }, { rule, moves = 0 }) {
      try {
        // wait for init?
        if (!controllerContract) await dispatch('init')
        // connect wallet?
        if (!state.address || !signer) await dispatch('connect')

        // setup
        const contractSigner = controllerContract.connect(signer)
        console.log({rule})
        // rule = ethers.utils.hexZeroPad(ethers.utils.hexlify(Number(rule)), 12)
        console.log({rule})
        const price = await dispatch('getMintPrice')
        // confirm...
        const tx = await contractSigner.publicMint(rule, moves.toString(), { value: price.toString() })
        console.log('my new mint tx:', tx)
        return tx
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async turmiteMove ({ state, dispatch }, { tokenId, moves }) {
      try {
        if (!nftContract) await dispatch('init')

        const contractSigner = nftContract.connect(signer)

        const tx = await contractSigner.moveTurmite(tokenId, moves)

        return tx
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    // async getPaused ({ state, dispatch }) {
    //   try {
    //     if (!controllerContract) await dispatch('init')
    //     return controllerContract.paused()
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    /* buy artwork */
    // async buy ({ state, dispatch, rootGetters }, workId) {
    //   try {
    //     const work = await dispatch('getWork', { id: workId, flush: true })
    //     // !! unavailable
    //     if (!work.exists) throw new Error(`!! Work ${workId} doesn't exist`)
    //     if (Number(work.printed) >= Number(work.editions)) throw new Error(`!! Work ${workId} is sold out`)
    //     if (work.paused) throw new Error(`!! Work ${workId} is locked. Please wait for release or try again shortly.`)

    //     // TODO insuff balance

    //     // wallet connected ?
    //     if (!state.address || !signer) await dispatch('connect')

    //     // !! insufficient balance
    //     const balance = await rootGetters.userBalance()
    //     if (bn.from(balance).lt(work.price)) throw new Error(`!! Insufficient funds in your wallet\n${state.address}`)

    //     // sign...
    //     const contractSigner = controllerContract.connect(signer)
    //     // tx
    //     return contractSigner.buy(state.address, workId, { value: work.price })

    //     // refresh work data for app
    //     // dispatch('getWork', { id: workId, flush: true })
    //   } catch (e) {
    //     console.error('@buy:', e)
    //     // track
    //     exception({ description: `@buy: ${e.message}`, fatal: false })
    //     // TODO - more elegant UX error ?
    //     if (e.message?.includes('!! ')) {
    //       alert(e.message.replace('!! ', ''))
    //     }
    //   }
    // },

    /* buy by ID */
    // async buyByID ({ state, dispatch, rootGetters }, { tokenId }) {
    //   try {
    //     const workId = Math.floor(tokenId / 1000000)
    //     const workSpace = workId * 1000000
    //     const editionId = tokenId - workSpace
    //     const bn = mixed => new web3.utils.BN(mixed)

    //     const work = await dispatch('getWork', { id: workId, flush: true })
    //     // !! unavailable
    //     if (!work.exists) throw new Error(`!! Work ${workId} doesn't exist`)
    //     // !! paused
    //     if (work.paused) throw new Error(`!! Work ${workId} is locked. Please wait for release or try again shortly.`)

    //     // wallet connected ?
    //     if (!state.address) {
    //       await dispatch('connect')
    //     }

    //     // !! not enough ETH
    //     const balance = await rootGetters.userBalance()
    //     const insufficientFunds = bn(balance).lt(bn(work.price))
    //     if (insufficientFunds) throw new Error(`!! Insufficient funds in your wallet\n${state.address}`)

    //     // buy
    //     await controllerContract.methods
    //       .buyByID(state.address, workId, editionId)
    //       .send({ from: state.address, value: work.price })
    //     // refresh work data for app
    //     dispatch('getWork', { id: workId, flush: true })
    //   } catch (e) {
    //     console.error('@buyByID:', e)
    //     // track
    //     exception({ description: `@buyByID: ${e.message}`, fatal: false })
    //     // TODO - more elegant UX error ?
    //     if (e.message?.includes('!! ')) {
    //       alert(e.message.replace('!! ', ''))
    //     }
    //   }
    // },

    /* buy token by id */
    // async buyByID ({ state, dispatch, rootGetters }, { tokenId }) {
    //   try {
    //     const workId = Math.floor(tokenId / 1000000) // 12
    //     const workSpace = workId * 1000000 // 12000000
    //     const editionId = tokenId - workSpace // 1

    //     // get work...
    //     const work = await dispatch('getWork', { id: workId, flush: true })

    //     // !! unavailable
    //     if (!work.exists) throw new Error(`!! Work ${workId} doesn't exist`)
    //     // !! paused
    //     if (work.paused) throw new Error(`!! Work ${workId} is locked. Please wait for release or try again shortly.`)

    //     // wallet connected ?
    //     if (!state.address || !signer) await dispatch('connect')

    //     // !! not enough ETH
    //     const balance = await rootGetters.userBalance()
    //     if (bn.from(balance).lt(work.price)) throw new Error(`!! Insufficient funds in your wallet\n${state.address}`)

    //     // sign...
    //     const contractSigner = controllerContract.connect(signer)
    //     // tx
    //     return contractSigner.buyByID(state.address, workId, editionId, { value: work.price })

    //     // refresh work data for app
    //     // dispatch('getWork', { id: workId, flush: true })
    //   } catch (e) {
    //     console.error('@buyByID:', e)
    //     // track
    //     exception({ description: `@buyByID: ${e.message}`, fatal: false })
    //     // TODO - more elegant UX error ?
    //     if (e.message?.includes('!! ')) {
    //       alert(e.message.replace('!! ', ''))
    //     }
    //   }
    // },

    /* read artwork */
    // async getWork ({ state, commit }, { id, flush }) {
    //   let work = state.works.find(work => work.id === id)
    //   if (!flush && work) return work

    //   if (!controllerContract) {
    //     console.warn('controller not set yet')
    //     return
    //   }
    //   // get new data
    //   if (id && !isNaN(id)) {
    //     try {
    //       work = await controllerContract.methods.works(id).call()
    //       work = { id, ...work } // add id
    //       commit('SAVE_WORK', work)
    //     } catch (e) {
    //       console.error('@getWork', e)
    //     }
    //   }
    //   return work
    // },

    /* read work from chain */
    // async getWork ({ state, commit, dispatch }, { id, flush }) {
    //   try {
    //     // saved?
    //     let work = state.works.find(work => work.id === id)
    //     if (!flush && work) return work

    //     // !! invalid id
    //     if (!id || isNaN(id)) {
    //       throw new Error(`invalid work id: ${id}`)
    //     }

    //     if (!controllerContract) {
    //       await dispatch('init')
    //     }

    //     // fetch...
    //     work = await controllerContract.works(id)
    //     work = { id, ...work } // add id
    //     // save
    //     commit('SAVE_WORK', work)
    //     return work
    //   } catch (e) {
    //     console.warn('@getWork', e)
    //     return null
    //   }
    // },

    /* get metadata of work (if released) */
    // async getMetadata ({ state, commit }, { token, work, isViewer = false }) {
    //   try {
    //     token = token || Number(work) * 1000000
    //     work = work || Math.floor(Number(token) / 1000000)

    //     // !! is not a number
    //     if (isNaN(token)) throw new Error(`Token ID is not a number: ${token}`)

    //     // return saved ?
    //     const saved = state.metadatas.find(metadata => metadata._token === token)
    //     const now = new Date().getTime()
    //     const release = saved && saved.release && new Date(saved.release).getTime()
    //     const hasSinceReleased = release && release > 0 && now >= release
    //     if (saved && !hasSinceReleased) {
    //       return saved
    //     }
    //     // fetch new
    //     // query parameters
    //     let params = []
    //     if (state.networkId) params.push(`network=${state.networkId}`)
    //     if (isViewer) params.push('viewer=1')
    //     params = params.length ? '?' + params.join('&') : ''
    //     const url = `/.netlify/functions/metadata/${token}${params}`
    //     // go!
    //     let metadata = await fetch(url).then(resp => resp.json())
    //     // process
    //     if (metadata && metadata.name) {
    //       metadata = { _work: work, _token: token, ...metadata }
    //       commit('SAVE_METADATA', metadata)
    //       return metadata
    //     }
    //     return null
    //   } catch (e) {
    //     console.error(e)
    //   }
    // },

    /* read owner by token id from chain */
    async getNFTOwnerByTokenId ({ state, commit, dispatch }, tokenId) {
      try {
        // saved?
        // const token = state.tokens.find(token => token[0] === tokenId) || []
        // let owner = token && token[1]
        // if (owner) return owner
        // fetch...
        if (!nftContract) await dispatch('init')
        let owner = await nftContract.ownerOf(tokenId)
        // save
        // commit('SAVE_TOKEN', [tokenId, owner])
        return owner
      } catch (e) {
        // console.error(e)
        // seems to error if token doesn't exist...
        console.warn(`get owner error / token doesn't exist? (${tokenId})`)
        return null
      }
    },

    // method for signing typed data
    // web3.js currently has no method (v1.7)
    // adapted from this guide:
    // * https://medium.com/metamask/scaling-web3-with-signtypeddata-91d6efc8b290
    // async signMessage ({ state, dispatch }, message = 'Please sign this message to continue.') {
    //   try {
    //     if (!state.address) await dispatch('connect')

    //     // build msg(s)
    //     const msgParams = [
    //       {
    //         type: 'string', // Any valid solidity type
    //         name: 'Message', // Any string label you want
    //         value: message // The value to sign
    //       }
    //       // {
    //       //   type: 'uint32',
    //       //      name: 'A number',
    //       //      value: '1337'
    //       //  }
    //     ]

    //     // sign...
    //     return new Promise((resolve, reject) => {
    //       web3.currentProvider.sendAsync({
    //         method: 'eth_signTypedData',
    //         params: [msgParams, state.address],
    //         from: state.address
    //       }, (err, result) => {
    //         // errors
    //         err = err || result.error
    //         if (err) {
    //           reject(err)
    //         }
    //         console.log('Signed message: ', result)
    //         // return signature
    //         resolve({ msgParams, signature: result.result })
    //       })
    //     })
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    // async signMessageEthers ({ state, dispatch }, message = 'Please sign this message to continue.') {
    //   try {
    //     if (!signer) await dispatch('connect')

    //     // const provider = new ethers.providers.Web3Provider(window.ethereum)

    //     // MetaMask requires requesting permission to connect users accounts
    //     // await provider.send("eth_requestAccounts", []);

    //     // const signer = provider.getSigner()

    //     // message = 'hello world'
    //     const signature = await signer.signMessage(message)
    //     console.log({ signature })

    //     return { signature }
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    async resolveAddress ({ state, getters, commit, dispatch }, { address, queryOpenSea = false }) {
      try {
        if (!address) {
          // console.warn('No address provided')
          return undefined
        }

        // sanitize
        address = address.toLowerCase()

        // saved?
        const saved = state.addresses[address]
        if (saved && saved.ens !== undefined) {
          return saved
        }

        // fetch new...
        // if (!provider) await dispatch('init')
        // lookup on mainnet
        const provider = new ethers.getDefaultProvider(networks[1].infura)
        const ens = await provider.lookupAddress(address)

        // fetch from opensea...
        let openSea
        if (!ens && queryOpenSea) {
          openSea = await dispatch('getAddressOpenSeaName', address)
        }

        // save even if null so we don't have to lookup again
        commit('SAVE_ADDRESS', { address, ens, openSea })

        // if (ens) {
        //   // get records async...
        //   const resolver = await provider.getResolver(ens)
        //   const records = ['avatar', 'url', 'com.twitter', 'vnd.twitter', 'com.github', 'vnd.github', 'com.discord', 'vnd.discord']
        //   // records...
        //   records.forEach(name => {
        //     resolver.getText(name)
        //       .then(value => commit('SAVE_ADDRESS_RECORD', { address, record: { name, value } }))
        //       // .catch(e => console.error(`Error getting ENS text record (${name} from ${ens}): ` + e ))
        //   })
        // }

        return { ens }
      } catch (e) {
        console.error(e)
        return null
      }
    },

    async fetchFromOpenSea ({ state, dispatch }, { path, priority = 1 }) {
      try {
        if (!state.networkId) await dispatch('init')

        const prefix = state.networkId === 1 ? '' : 'testnets-'
        const domain = `https://${prefix}api.opensea.io`
        const headers = {}

        // need API key?
        if (state.networkId === 1) {
          headers['X-API-KEY'] = 'e74704784fe64c60a67b89239e3e75e0'
        }
        // console.log(headers)

        // fetch...
        const resp = await fetch(domain + path, { headers })

        if (resp.status === 200) {
          // good!
          const json = await resp.json()
          return json
        } else if (resp.status === 429) {
          // throttled... wait a second
          return new Promise(resolve => setTimeout(() => resolve(dispatch('fetchFromOpenSea', { path, priority })), 1000 * priority))
        } else {
          // other error
          const text = await resp.text()
          throw new Error('OpenSea API:' + text)
        }
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getAddressOpenSeaName ({ state, dispatch }, address) {
      try {
        const resp = await dispatch('fetchFromOpenSea', { path: `/api/v1/account/${address}`, priority: 1.2 })

        return resp.data?.user?.username
      } catch (e) {
        console.error(e)
        return null
      }
    }
  }
})
