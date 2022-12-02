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
import networks from '../networks'

let /*provider,*/ signer, initializing, walletProvider, web3ModalProvider

const infuraProjectID = import.meta.env.VITE_APP_INFURA_PROJECT_ID

const appDefaultNetworkId = Number(import.meta.env.VITE_APP_FALLBACK_NETWORK_ID ?? 1)

// setup web3 modal
let web3Modal
function setWeb3Modal (networkName) {
  networkName = networkName === 'ethereum' ? 'mainnet' 
    : networkName === 'optimism-goerli' ? undefined // not in their list :/
      : networkName

  web3Modal = new Web3Modal({
    network: networkName, // optional - NOTE, doesn't seem to work with "polygon" as name...
    cacheProvider: true, // optional
    providerOptions: { // required
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: infuraProjectID, // required
          rpc: {
            10: networks[10].infura
            // 420: networks[420].infura
          }
        },
      }
    },
    theme: 'dark'
  })
}
setWeb3Modal()

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
      return Object.keys(networks).find(key => networks[key].name === networkName?.toLowerCase())
    },
    network: (state, getters) => ({ networkName }) => {
      const chainId = getters.chainId({ networkName }) || appDefaultNetworkId
      return networks[chainId]
    },
    contractAddr: (state, getters) => ({ networkName }) => {
      const chainId = getters.chainId({ networkName })
      return NFTContractDeploy.networks[chainId]?.address
    },
    etherscanLink: (state, getters) => ({ hash, networkName, address }) => {
      const network = getters.network({ networkName })
      const contractAddr = getters.contractAddr({ networkName })
      let path = network?.explorer.domain
      path += hash ? `/tx/${hash}`
        : `/address/${address ?? contractAddr}`
      return path
    },
    marketplaceLink: (state, getters) => ({ token, account, networkName, path }) => {
      const network = getters.network({ networkName })
      const contractAddr = getters.contractAddr({ networkName })

      let url = network?.marketplace.domain
      
      url += token !== undefined ? `${ network.marketplace.assetPath }/${contractAddr}/${token}`
        : account ? `/${account}`
          : path || `/collection/${contractAddr}`
      
      return url
    },
    meta: state => ({ title, descrip, img, video }) => {
      const meta = []
      // defaults
      const siteTitle = 's̷̰̃t̴̫̊r̶͔̽ả̷̜y̴̼͂l̸̙͛į̸͆g̴̘̎h̷̜̀ṭ̸͂ ̸̰̊p̵̞̅ȑ̴̙ơ̸͍t̶̗̑o̶͂͜ć̵͍ȏ̸͕l̷̗͗'
      const siteDescrip = 'by paul seidler (terra0) - an on-chain, NFT multiplayer game. presented by folia 𐡸'
      const siteImg = 'https://images.prismic.io/folia-dev/ae2e97e5-86ec-4bdc-9e35-2f246ede5758_vlcsnap-2022-11-21-16h55m05s415.png?auto=compress,format'
      const siteVideo = 'https://prismic-io.s3.amazonaws.com/folia-dev/580b753f-04cd-4fb8-b3fa-b62ed7f4f5ad_straylight-1a-1080p30.mp4'
      
      // meta description is logo-title if custom page title
      const description = descrip ? descrip : !descrip && title ? undefined : siteDescrip
      // 
      title = title ? `${title}` : siteTitle
      // use site video if no custom image, so doesn't override custom img
      video = img ? undefined : siteVideo
      // custom image
      const image = img || siteImg
      
      // add
      const data = {
        htmlAttrs: {
          lang: 'en',
          amp: false,
        },
        title,
        // description,
        og: {
          title,
          // description,
          site_name: siteTitle,
        },
        twitter: {
          title,
          // description,
          card: 'summary_large_image',
          domain: 'straylight.folia.app'
        }
      }
      if (description) {
        data.description = data.og.description = data.twitter.description = description
      }
      if (image) {
        data.og.image = data.twitter.image = image
      }
      if (video) {
        data.og.video = data.twitter.video = video
      }
      
      return data
    },
    docsLink: state => (path) => {
      return `${import.meta.env.VITE_APP_DOCS_ORIGIN}/straylightdocs${path ?? ''}`
    }
  },
  mutations: {
    SIGN_IN (state, { address }) {
      state.address = address.toLowerCase()
      console.log('signed in', address)
    },
    SIGN_OUT (state) {
      state.address = undefined
      state.givenNetworkId = null
      
      walletProvider = undefined
      signer = undefined
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
    async connect ({ state, commit, dispatch }, networkName) {
      try {
        if (networkName) {
          setWeb3Modal(networkName)
        }

        // connect and update provider, signer
        web3ModalProvider = await web3Modal.connect()
        walletProvider = new ethers.providers.Web3Provider(web3ModalProvider)
        signer = walletProvider.getSigner()

        // set user address
        const address = await signer.getAddress()
        commit('SIGN_IN', { address })

        // set given network id
        const { chainId } = await walletProvider.getNetwork()
        commit('SET_GIVEN_NETWORK_ID', chainId)

        dispatch('listenToWalletProvider', web3ModalProvider)
        
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
      // reset provider
      // dispatch('setupContracts')
    },
    
    /* wallet events */
    listenToWalletProvider ({ commit, dispatch }) {
      if (!web3ModalProvider?.on) return

      // account changed (or disconnected)
      web3ModalProvider.on('accountsChanged', accounts => {
        console.log('accountsChanged', accounts)
        if (!accounts.length) {
          return dispatch('disconnect')
        }
        commit('SIGN_IN', accounts[0])
      })

      // changed network
      web3ModalProvider.on('chainChanged', async chainId => {
        console.log('network changed', chainId)
        // reload page so data is correct...
        // window.location.reload()

        // try updating provider + signer
        try {
          const availableProvider = web3ModalProvider || window.ethereum
          if (availableProvider) {
            walletProvider = new ethers.providers.Web3Provider(availableProvider)
            
            const { chainId } = await walletProvider.getNetwork()
            commit('SET_GIVEN_NETWORK_ID', chainId)
    
            // update signer if still signed in
            if (signer) {
              signer = walletProvider.getSigner()
            }
          } 
        } catch (e) {
          alert('An error occurred while switching networks. Refresh required.')
          window.location.reload()
        }
      })

      // random disconnection? (doesn't fire on account disconnect)
      web3ModalProvider.on('disconnect', error => {
        console.error('disconnected?', error)
        dispatch('disconnect')
      })
    },

    async switchNetwork ({ dispatch }, { chainId, name }) { 
      // dont attempt to switch if browser doesn't have MetaMask
      // or! wallet is connect via WalletConnect (since at least Rainbow doesn't let you switch there)
      if (!window.ethereum || walletProvider?.provider?.wc) {
        throw new Error('No provider to change network')
      }

      // find chainId?
      chainId = chainId || Object.keys(networks).find(key => networks[key].name === name)

      // convert to hex
      chainId = ethers.utils.hexValue(Number(chainId))

      try {
        // switch...
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }]
        })  

        // reload app
        // if (reload) {
        //   window.location.reload()
        //   return
        // }

        // provider + signer updates in networkChanged listener...
        
        return true
      } catch (e) {
        console.error(e)
        
        // try adding the chain first
        if (e?.code === 4902) {
          console.log('trying to add chain...')
          try {
            const network = networks[parseInt(chainId)]
            if (!network) {
              throw new Error(`Network is not supported (chainId: ${chainId})`)
            }

            const chainInfo = network.chainInfo
            chainInfo.chainId = ethers.utils.hexValue(chainInfo.chainId)
            
            // add...
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [chainInfo]
            })

            // try switching again
            return dispatch('switchNetwork', { chainId })

          } catch (e) {
            // adding failed
            console.error('could not add chain', e)
            throw e
          }
        }

        throw e
      }
    },

    async getProvider ({ state, commit }, { network }) {
      let provider = walletProvider
      let targetChainId = network?.id
        ?? Object.keys(networks).find(key => networks[key]['name'] === network?.name)
          ?? appDefaultNetworkId

      // get provider from browser/wallet provider if needed
      if (!provider && window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum)

        // lookup chain id if not connected to browser wallet
        // because we don't know if they switched network...
        if (!state.address) {
          try {
            const { chainId } = await provider.getNetwork()
            commit('SET_GIVEN_NETWORK_ID', chainId)
          } catch (e) {
            console.error("couldn't lookup window's chain id")
            commit('SET_GIVEN_NETWORK_ID', null)
          }
        }
      }

      // use infura if no provider, or given-provider chain is not on target chain
      if (!provider || (targetChainId && state.givenNetworkId !== Number(targetChainId))) {
        // if not use infura on targetChain
        provider = new ethers.getDefaultProvider(networks[targetChainId].infura)
      }

      // console.log({ givenChainId: state.givenNetworkId, targetChainId })

      return { provider, chainId: targetChainId /*|| givenChainId*/ }
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
          events = events.reverse().map(event => {
            const blockNumber = event.blockNumber
            const tokenId = event.args[0].toString()
            return {
              id: `${blockNumber}-${tokenId}`,
              type: 'mint',
              blockNumber: event.blockNumber,
              boardId: event.args[2].toString(),
              tokenId,
              rule: event.args[1].toString().toLowerCase().substr(2),
              getBlock: event.getBlock,
              getReceipt: event.getTransactionReceipt,
            }
          })
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
          moves = events.reverse().map(event => {
            const blockNumber = event.blockNumber
            const tokenId = event.args[0].toString()
            const moves = event.args[2].toString()
            
            return {
              id: `${blockNumber}-${tokenId}-${moves}`, // for component :key-ing
              type: 'move',
              blockNumber,
              boardId: event.args[1].toString(),
              tokenId,
              moves: event.args[2].toString(),
              getReceipt: event.getTransactionReceipt,
              getBlock: event.getBlock,
            }
          })
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

    async getMaxTurmites ({ getters, dispatch }, { cached = true, network }) {
      try {
        const networkData = getters.network({ networkName: network.name })
        const saved = networkData?.maxTurmites
        if (saved && cached) {
          return saved
        }

        const nftContract = await dispatch('getNFTContract', { network })
        const max = (await nftContract.maxnumbturmites()).toNumber()

        if (networkData) {
          // save to networks object
          networkData.maxTurmites = max
        }

        return max
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async mint ({ state, dispatch }, { rule, moves = 0, network }) {
      try {
        // wait for init?
        const contract = await dispatch('getControllerContract', { network })

        // connect wallet?
        if (!state.address || !signer) {
          await dispatch('connect')
        }

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

    async isWalletCorrectNetwork ({ getters, dispatch }, { network }) {
      try {
        if (!signer || !walletProvider) {
          await dispatch('connect')
        }
  
        const { chainId } = await walletProvider.getNetwork()
        const turmiteChainId = getters.chainId({ networkName: network.name})
        
        if (chainId?.toString() !== turmiteChainId?.toString()) {
          throw new Error(`WALLET IS WRONG NETWORK`)
        }
        
        return true
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async moveTurmite ({ state, dispatch }, { tokenId, moves, network }) {
      try {
        await dispatch('isWalletCorrectNetwork', { network })

        const nftContract = await dispatch('getNFTContract', { network })

        const contractSigner = nftContract.connect(signer)

        const tx = await contractSigner.moveTurmite([tokenId, moves])

        return tx
      } catch (e) {
        console.error(e)
        throw e
      }
    },

    async reprogramTurmite ({ state, dispatch }, { tokenId, rule, network }) {
      try {
        await dispatch('isWalletCorrectNetwork', { network })

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
            const blockNumber = event.blockNumber
            const tokenId = event.args[0].toString()
            const rule = event.args[1].toString().toLowerCase().substr(2)
            
            return {
              id: `${blockNumber}-${tokenId}-${rule}`,
              type: 'reprogram',
              blockNumber: event.blockNumber,
              tokenId,
              boardId: (Math.floor(tokenId / 4) + 1).toString(),
              rule,
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
