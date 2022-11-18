import { createStore } from 'vuex'
// contracts
import NFTContractDeploy from '../../contracts/Straylight.js'
import ControllerDeploy from '../../contracts/Minting.js'
// web3
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
// Wallet Connect - directly import .js file since import breaks `vite build`
// see: https://github.com/vitejs/vite/issues/7257
import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'

let /*provider,*/ signer, initializing

const infuraProjectID = import.meta.env.VITE_APP_INFURA_PROJECT_ID

const networks = {
  1: { name: 'ethereum', layer: 'ethereum', infura: `https://mainnet.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://etherscan.io' }, marketplace: { name: 'OpenSea', domain: 'https://opensea.io', assetPath: '/assets/ethereum'} },
  5: { name: 'goerli', layer: 'ethereum', infura: `https://goerli.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://goerli.etherscan.io' }, marketplace: { name: 'OpenSea', domain: 'https://testnets.opensea.io', assetPath: '/assets/goerli' } },
  10: { name: 'optimism', layer: 'optimism', infura: `https://optimism-mainnet.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://blockscout.com/optimism/goerli' }, marketplace: { name: 'Quixotic', domain: 'https://quixotic.io', assetPath: '/assets' } },
  420: { name: 'optimism-goerli', layer: 'optimism', infura: `https://optimism-goerli.infura.io/v3/${infuraProjectID}`, explorer: { name: 'Etherscan', domain: 'https://blockscout.com/optimism/goerli' }, marketplace: { name: 'Quixotic', domain: 'https://goerli.quixotic.io', assetPath: '/assets' } },
}
const appDefaultNetworkId = Number(import.meta.env.VITE_APP_FALLBACK_NETWORK_ID || 1)

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
        rpc: {
          420: networks[420].infura,
        }
      },
    }
  },
  theme: 'dark'
})

export default createStore({
  // modules: { profiles },
  state () {
    return {
      networks,

      address: null,
      givenNetworkId: null,

      appNetworkId: null,
      appDefaultNetworkId,

      contractAddr: null,

      mintPrice: undefined,

      mints: null,
      mintCount: undefined,
      mintEvents: {}, // save per network
      tokens: [],

      moves: undefined,
      movesMax: 4000, // above seems to throw rpc error?

      reprogrammedEvents: {}, // save per networkre

      // old
      reserveAuctionContract: null,

      works: [],
      metadatas: [],
      addresses: {},
    }
  },
  getters: {
    // weiToETH: () => (wei) => web3?.utils.fromWei(wei) ?? '-',
    weiToETH: () => wei => ethers.utils.formatUnits(wei) ?? '...',
    // ethToWei: () => (eth) => web3?.utils.toWei(eth) ?? '-',
    ethToWei: () => (eth) => ethers.utils.parseUnits(eth).toString() ?? '-',
    workId: () => (uid, prefix) => {
      const id = Number(uid) // / 1000000
      return prefix ? ('00' + id).slice(-3) // 001
        : id // 1 - for contract communication
    },
    addrShort: () => (addr) => addr ? '0x' + addr.slice(2, 6).toUpperCase() + '...' + addr.slice(-4).toUpperCase() : '...',
    userBalance: (state) => (addr) => provider?.getBalance(addr || state.address) || '0', // wei
    isSoldOut: () => (work) => {
      return work && Number(work.editions) && Number(work.printed) >= Number(work.editions)
    },
    isConnectedAddr: (state) => (addr) => addr && addr.toLowerCase() === state.address,
    chainId: () => ({ networkName }) => {
      // get chainId from networkName (of supported networks)
      return Object.keys(networks).find(key => networks[key].name === networkName.toLowerCase())
    },
    network: (state, getters) => ({ networkName }) => {
      const chainId = getters.chainId({ networkName }) || appDefaultNetworkId
      return networks[chainId]
    },
    contractAddr: (state, getters) => ({ networkName }) => {
      const chainId = getters.chainId({ networkName })
      return NFTContractDeploy.networks[chainId]?.address
    },
    etherscanLink: (state, getters) => ({ hash, networkName }) => {
      const network = getters.network({ networkName })
      const contractAddr = getters.contractAddr({ networkName })
      let path = network?.explorer.domain
      path += hash ? `/tx/${hash}`
        : `/address/${contractAddr}`
      return path
    },
    marketplaceLink: (state, getters) => ({ token, account, networkName }) => {
      const network = getters.network({ networkName })
      const contractAddr = getters.contractAddr({ networkName })

      let path = network?.marketplace.domain
      
      path += token !== undefined ? `${ network.marketplace.assetPath }/${contractAddr}/${token}`
        : account ? `/${account}`
          : `/collection/${contractAddr}` // default to collection? (404 on OpenSea...)
      
      return path
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
    docsLink: state => (path) => {
      return `${import.meta.env.VITE_APP_DOCS_ORIGIN}/${path}`
    }
  },
  mutations: {
    SIGN_IN (state, { address }) {
      state.address = address.toLowerCase()
      console.log('signed in', address)
    },
    SIGN_OUT (state) {
      state.address = undefined
      // state.givenNetworkId = null
      console.log('wallet disconnected')
    },
    SET_GIVEN_NETWORK_ID (state, chainId) {
      state.givenNetworkId = chainId
      console.log('given network:', chainId)
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

    // SET_CONTRACTS (state, { chainId, provider }) {
    //   // set network id
    //   state.appNetworkId = chainId
    //   console.log('app network:', chainId)
      
    //   // nft
    //   nftContract = new ethers.Contract(NFTContractDeploy.networks[chainId].address, NFTContractDeploy.abi, provider)
    //   state.contractAddr = NFTContractDeploy.networks[chainId].address.toLowerCase()
    //   console.log('token contract:', NFTContractDeploy.networks[chainId].address)

    //   // controller
    //   controllerContract = new ethers.Contract(ControllerDeploy.networks[chainId].address, ControllerDeploy.abi, provider)
    //   console.log('controller contract:', ControllerDeploy.networks[chainId].address)
    // },

    SAVE_ADDRESS (state, { address, ens, openSea }) {
      const addrs = JSON.parse(JSON.stringify(state.addresses))
      addrs[address.toLowerCase()] = { ens, openSea }
      state.addresses = addrs
    },

    SET_MINT_PRICE (state, bigNumber) {
      state.mintPrice = bigNumber
    },

    SAVE_MINTS (state, mints) {
      state.mints = mints
    },

    SET_MINT_COUNT (state, count) {
      state.mintCount = count
    },

    SAVE_MOVES (state, moves) {
      state.moves = moves
    },

    SAVE_NETWORK_MINT_EVENTS (state, { networkName, mintEvents }) {
      state.mintEvents[networkName] = mintEvents
    },

    SAVE_NETWORK_REPROGRAM_EVENTS (state, { networkName, events }) {
      state.reprogrammedEvents[networkName] = events
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

          // await dispatch('setProvider', networkName)



          // fallback provider
          // if (!provider) {
          //   await dispatch('setupFallbackProvider')
          // }

          // await dispatch('setupContracts')


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

    /* connect wallet */
    async connect ({ state, commit, dispatch }) {
      try {
        // connect and update provider, signer
        const walletProvider = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(walletProvider)
        signer = provider.getSigner()

        // set user address
        const address = await signer.getAddress()
        commit('SIGN_IN', { address })

        // set given network id
        const { chainId } = await provider.getNetwork()
        commit('SET_GIVEN_NETWORK_ID', chainId)

        dispatch('listenToWalletProvider', walletProvider)
        
        return { address, chainId }
      } catch (e) {
        console.error(e)
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
      signer = null
      // givenProvider = null
      // reset provider
      // dispatch('setupContracts')
    },
    
    /* wallet events */
    listenToWalletProvider ({ commit, dispatch }, walletProvider) {
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

    async switchNetwork ({ dispatch }, { chainId, name }) {
      // set
      chainId = chainId || Object.keys(networks).find(key => networks[key].name === name)

      // convert to hex
      chainId = ethers.utils.hexValue(Number(chainId))

      // if (!window.ethereum) {
      //   throw new Error('No provider to change network')
      // }

      try {
        // switch...
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        })  

        // reload app
        window.location.reload()
      } catch (e) {
        console.error(e)
        
        // try adding the chain first
        // if (e?.code === 4902) {
        //   console.log('trying to add chain...')
        //   try {
        //     // add...
        //     await window.ethereum.request({
        //       method: 'wallet_addEthereumChain',
        //       params: [{ chainId }]
        //     })

        //     // try again
        //     return dispatch('switchNetwork', { chainId })

        //   } catch (e) {
        //     // adding failed
        //     console.error('could not add chain', e)
        //   }
        // }

        // alert('Could not switch networks. You may need to add it to your wallet.')
        throw e
      }
    },

    async getProvider ({ commit }, { network }) {
      let provider, givenChainId
      let targetChainId = network?.id
        || Object.keys(networks).find(key => networks[key]['name'] === network?.name)

      // try browser/wallet provider first
      if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum)

        // check on supported network
        try {
          const { chainId } = await provider.getNetwork()
          givenChainId = chainId
          
          commit('SET_GIVEN_NETWORK_ID', givenChainId)

          // given provider is not on the target network
          if (targetChainId && chainId !== Number(targetChainId)) {
            provider = undefined
          }
        } catch (e) {
          console.error('error getting given provider network', e)
        }
      }

      // fallback to infura
      if (!provider) {
        targetChainId = targetChainId || appDefaultNetworkId
        provider = new ethers.getDefaultProvider(networks[targetChainId].infura)
      }

      return { provider, chainId: targetChainId || givenChainId }
    },

    async getNFTContract ({ dispatch }, { network }) {
      const { provider, chainId } = await dispatch('getProvider', { network })
      const contract = new ethers.Contract(NFTContractDeploy.networks[chainId].address, NFTContractDeploy.abi, provider)
      return contract
    },

    async getControllerContract ({ dispatch }, { network }) {
      const { provider, chainId } = await dispatch('getProvider', { network })
      const contract = new ethers.Contract(ControllerDeploy.networks[chainId].address, ControllerDeploy.abi, provider)
      return contract
    },

    // async setProvider ({ dispatch }, desiredNetworkName) {
    //   let givenChainId

    //   // find desired network

    //   const desiredNetwork = Object.values(networks).find(net => net.name === desiredNetworkName)

    //   // look for browser provider if not set
    //   if (!provider && window.ethereum) {
    //     // metamask/browser
    //     provider = new ethers.providers.Web3Provider(window.ethereum)
    //   }

    //   // get chainId of this provider
    //   try {
    //     const { chainId } = await provider.getNetwork()
    //     givenChainId = chainId
    //   } catch (e) {
    //     console.error('error getting given provider chain id', e)
    //   }

    //   // store even if not provided
    //   commit('SET_GIVEN_NETWORK_ID', givenChainId)

    //   // check if supported network
    //   if (!provider || !Object.keys(networks).includes(givenChainId)) {
    //     console.warn(`Provider/Wallet network not supported (${givenChainId}). Loading from infura default network: ${appDefaultNetworkId}...`)
        
    //     chainId = appDefaultNetworkId
    //     provider = new ethers.getDefaultProvider(networks[appDefaultNetworkId].infura)
    //   } else {
    //     // given provider is supported :)
    //     chainId = givenChainId
    //   }

    //   }
    // },

    // async setupFallbackProvider ({ dispatch }) {
    //   try {
    //     if (window.ethereum) {
    //       // metamask/browser
    //       provider = new ethers.providers.Web3Provider(window.ethereum)
    //     } else {
    //       // infura fallback
    //       console.log(appDefaultNetworkId)
    //       provider = new ethers.getDefaultProvider(networks[appDefaultNetworkId].infura)
    //     }

    //     await dispatch('setupContracts', { provider })

    //     return true
    //   } catch (e) {
    //     console.error(e)
    //   }
    // },

    // getNetworkId ({ commit }, provider) {
    //   return provider.getNetwork()
    //     .then(network => commit('SET_NETWORK_ID', network.chainId))
    //     .catch(console.error)
    // },

    // async getNetwork ({ commit }, provider) {
    //   try {
    //     const { chainId } = await provider.getNetwork()
    //     // set network
    //     commit('SET_NETWORK_ID', chainId)
    //     // set contracts
    //     commit('SET_CONTRACTS', { chainId, provider })

    //     return chainId
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    // async setupContracts ({ commit }) {
    //   let chainId, givenChainId

    //   if (!provider && window.ethereum) {
    //     // metamask/browser
    //     provider = new ethers.providers.Web3Provider(window.ethereum)
    //   }

    //   try {
    //     const { chainId } = await provider.getNetwork()
    //     givenChainId = chainId
    //   } catch (e) {
    //     console.error('error getting given provider chain id', e)
    //   }

    //   // store even if not provided
    //   commit('SET_GIVEN_NETWORK_ID', givenChainId)

    //   // check if supported network
    //   if (!provider || !Object.keys(networks).includes(givenChainId)) {
    //     console.warn(`Provider/Wallet network not supported (${givenChainId}). Loading from infura default network: ${appDefaultNetworkId}...`)
        
    //     chainId = appDefaultNetworkId
    //     provider = new ethers.getDefaultProvider(networks[appDefaultNetworkId].infura)
    //   } else {
    //     // given provider is supported :)
    //     chainId = givenChainId
    //   }

    //   // set contracts
    //   commit('SET_CONTRACTS', { chainId, provider })      

    //   return true
    // },

    // async getNFTContract ({ dispatch }) {
    //   try {
    //     if (!nftContract) await dispatch('init')
    //     return nftContract
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    async getDeployBlock ({ state, dispatch }, { network }) {
      let deployBlock = 0
      if (network) {
        const chainId = network.id || Object.keys(networks).find(key => networks[key]["name"] === network.name)
        deployBlock = NFTContractDeploy.networks[chainId].blockNumber  
      }
      return deployBlock
    },

    async getBoardCount ({ state, dispatch }, { network }) {
      try {
        const nftContract = await dispatch('getNFTContract', { network })
        let count = await nftContract.boardcounter()
        count = count.toNumber()
        // console.log('count', count)
        // debugger

        // if (count === 0) {
        //   // check if any mints because counter is 0 after 1 mint ¯\_(ツ)_/¯ 
        //   const mints = await dispatch('getMints', { network })
        //   if (mints.length) {
        //     return Math.ceil(mints.length / 4)
        //   } else {
        //     return 0
        //   }
        // }
        return count
      } catch (e) {
        console.error(e)
        throw e
      }
    },
    
    async getBoardImage ({ state, dispatch }, { id, network }) {
      try {
        const nftContract = await dispatch('getNFTContract', { network })
        return nftContract.renderBoard(id)
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMints ({ state, commit, dispatch }, { cached = false, filter, network }) {
      try {
        let events = state.mintEvents[network.name] ?? []

        if (!events.length || !cached) {
          // else, get fresh events
          const fromBlock = await dispatch('getDeployBlock', { network })
          const nftContract = await dispatch('getNFTContract', { network })

          // get...
          events = await nftContract.queryFilter('TurmiteMint', fromBlock)
          // console.log({ mintEvents: events })

          // format
          events = events.reverse().map(event => ({
            type: 'mint',
            blockNumber: event.blockNumber,
            boardId: event.args[2].toString(),
            tokenId: event.args[0].toString(),
            rule: event.args[1].toString().toLowerCase().substr(2),
            getBlock: event.getBlock,
            getReceipt: event.getTransactionReceipt,
          }))
          // console.log({ mints: events })

          // SAVE
          commit('SAVE_NETWORK_MINT_EVENTS', { networkName: network.name, events })
        }

        // filter?
        if (filter) {
          if (typeof filter[1] === 'object') {
            events = events.filter(event => filter[1].includes(event[filter[0]]))
          } else {
            events = events.filter(event => event[filter[0]] === filter[1])  
          }
        }

        return events
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    // async findMint ({ dispatch }, { contract, tokenId }) {
    //   try {
    //     const events = await dispatch('getMintedEvents')
    //     // find mint event by matching contract and token id
    //     return events.find(event => {
    //       return event.args.contractAddress.toString().toLowerCase() === contract.toLowerCase() &&
    //         event.args.tokenId.toString().toLowerCase() === tokenId.toLowerCase()
    //     })
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    async getMintPrice ({ state, commit, dispatch }, { network }) {
      try {
        const contract = await dispatch('getControllerContract', { network })
        const price = await contract.mintPrice()
        return price
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMoves ({ state, commit, dispatch }, { cached = false, filter, network }) {
      try {
        let moves // = cached && state.moves ? state.moves : null
        
        if (!moves) {

          const fromBlock = await dispatch('getDeployBlock', { network })
          const nftContract = await dispatch('getNFTContract', { network })
          
          // get events...
          const events = await nftContract.queryFilter('TurmiteMove', fromBlock)
          // console.log({ moveEvents: events })

          // format
          moves = events.reverse().map(event => ({
            type: 'move',
            blockNumber: event.blockNumber,
            boardId: event.args[1].toString(),
            tokenId: event.args[0].toString(),
            moves: event.args[2].toString(),
            getReceipt: event.getTransactionReceipt,
            getBlock: event.getBlock,
          }))
          // console.log({ moves })
          
          // commit('SAVE_MOVES', moves)
        }

        // filter?
        if (filter) {
          if (typeof filter[1] === 'object') {
            moves = moves.filter(event => filter[1].includes(event[filter[0]]))
          } else {
            moves = moves.filter(event => event[filter[0]] === filter[1])  
          }
        }

        return moves
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getMintCount ({ state, commit, dispatch }, { network }) {
      try {
        const nftContract = await dispatch('getNFTContract', { network })
        const count = await nftContract.totalSupply()
        return count
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    // async listenForMints ({ state, dispatch }) {
    //   try {
    //     if (!controllerContract) await dispatch('init')
    //     // TODO - cancel if sold out?
    //     controllerContract.on('editionBought', (contractAddress, tokenId, newTokenId) => {
    //       console.log('new mint!', { contractAddress, tokenId, newTokenId })
    //       dispatch('getMintCount')
    //       dispatch('getMints', {})
    //     })
    //     console.log('listening for mints...')
    //   } catch (e) {
    //     console.error(e)
    //     throw e
    //   }
    // },

    async mint ({ state, dispatch }, { rule, moves = 0, network }) {
      try {
        // wait for init?
        const contract = await dispatch('getControllerContract', { network })

        // connect wallet?
        if (!state.address || !signer) await dispatch('connect')

        // check balance
        const price = await dispatch('getMintPrice', { network })
        const { provider } = await dispatch('getProvider', { network })
        const balance = await provider.getBalance(state.address)

        // !! insuff balance
        if (balance.lt(price)) {
          throw new Error(`Insufficient funds in your wallet`)
        }

        // setup
        const contractSigner = contract.connect(signer)

        // confirm...
        const tx = await contractSigner.publicMint(state.address, rule, moves.toString(), { value: price.toString() })
        console.log('my new mint tx:', tx)
        return tx
      } catch (e) {
        console.log(e.code)
        if (e?.code === 4001) {
          throw new Error('You rejected to the transaction.')
        }
        throw e
      }
    },

    async turmiteMove ({ state, dispatch }, { tokenId, moves, network }) {
      try {
        const nftContract = await dispatch('getNFTContract', { network })

        const contractSigner = nftContract.connect(signer)

        const tx = await contractSigner.moveTurmite(tokenId, moves)

        return tx
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async reprogramTurmite ({ state, dispatch }, { tokenId, rule, network }) {
      console.log(arguments[1])
      try {
        const nftContract = await dispatch('getNFTContract', { network })
        
        const contractSigner = nftContract.connect(signer)

        const tx = await contractSigner.reprogrammTurmite(tokenId, '0x' + rule)

        return tx
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async getReprograms ({ state, commit, dispatch }, { cached = false, filter, network }) {
      try {
        let events = state.reprogrammedEvents[network.name] ?? []
        
        if (!events.length || !cached) {
          // get latest events
          const fromBlock = await dispatch('getDeployBlock', { network })
          const nftContract = await dispatch('getNFTContract', { network })
          
          // get events...
          events = await nftContract.queryFilter('TurmiteReprogramm', fromBlock)
          // console.log({ reprogramEvents: events })

          // format
          events = events.reverse().map(event => {
            const tokenId = event.args[0].toString()
            const boardId = Math.floor(tokenId / 4).toString()
            
            return {
              type: 'reprogram',
              blockNumber: event.blockNumber,
              tokenId,
              boardId,
              rule: event.args[1].toString().toLowerCase().substr(2),
              getBlock: event.getBlock,
              getReceipt: event.getTransactionReceipt,
            }
          })
          // console.log({ reprograms: events })

          // save for caching
          commit('SAVE_NETWORK_REPROGRAM_EVENTS', { networkName: network.name, events })
        }

        // filter?
        if (filter) {
          const key = filter[0]
          const value = filter[1]
          if (typeof filter[1] === 'object') {
            events = events.filter(event => value.includes(event[key]))
          } else {
            events = events.filter(event => event[key] === value)  
          }
        }

        return events
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
    async getNFTOwnerByTokenId ({ state, commit, dispatch }, { tokenId, network }) {
      try {
        // saved?
        // const token = state.tokens.find(token => token[0] === tokenId) || []
        // let owner = token && token[1]
        // if (owner) return owner
        // fetch...
        const nftContract = await dispatch('getNFTContract', { network })
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

        return { address, ens, openSea }
      } catch (e) {
        console.error(e)
        return null
      }
    },

    async resolveENS ({ state, commit, dispatch }, ens) {
      try {
        // saved ?
        let address = Object.keys(state.addresses).find(key => ens && state.addresses[key].ens === ens)
        if (address) return address
        
        // resolve ENS on mainnet...
        const provider = new ethers.getDefaultProvider(networks[1].infura)
        address = await provider.resolveName(ens)
        
        if (address) {
          // save if resolved...
          commit('SAVE_ADDRESS', { address, ens })
        }

        return address
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
