// import { exception } from 'vue-gtag'

export default {
  namespaced: true,
  state: {
    myAssets: [], // connected wallet assets
    sourceAssets: {} // opensea data on source assets
  },

  getters: {
    contracts (state, getters, rootState) {
      // format to just addresses
      const contracts = rootState.collectionsList?.map(row => row[0].toLowerCase())
      return contracts
    }
  },

  mutations: {
    CLEAR_MY_ASSETS (state) {
      state.myAssets = []
    },
    SAVE_MY_ASSETS (state, assets) {
      state.myAssets = state.myAssets.concat(assets)
    },
    SAVE_SOURCE_ASSET (state, { contractAddress, tokenId, asset }) {
      const newAssets = JSON.parse(JSON.stringify(state.sourceAssets))
      newAssets[contractAddress + '_' + tokenId] = asset
      state.sourceAssets = newAssets
    }
  },

  actions: {
    async getWalletAssets ({ state, commit, getters, dispatch }, { address, cursor }) {
      try {
        // clear
        if (!cursor) {
          commit('CLEAR_MY_ASSETS')
        }

        // params
        address = address.toLowerCase()
        cursor = cursor ? `&cursor=${cursor}` : ''
        const limit = '&limit=50'

        // wait for contract list?
        if (!getters.contracts) await dispatch('getCollectionsList', null, { root: true })
        // filter by contract
        // EDIT: (TOO MANY GIVES 400 on OS API)
        // let contracts = getters.contracts.map(addr => '&asset_contract_addresses=' + addr.toLowerCase())
        // contracts = contracts.join('')

        // fetch from opensea...
        const json = await dispatch('fetchFromOpenSea', { path: `/api/v1/assets?owner=${address}${limit}${cursor}` }, { root: true })

        // filter for elligible assets
        let assets = json.assets.filter(asset => getters.contracts.includes(asset.asset_contract.address.toLowerCase()))

        // format
        assets = assets.map(asset => ({
          collection: {
            name: asset.collection?.name || asset.asset_contract.name,
            address: asset.asset_contract.address
          },
          tokenId: asset.token_id,
          name: asset.name,
          image: {
            thumb: asset.image_thumbnail_url
          }
        }))

        // save
        commit('SAVE_MY_ASSETS', assets)

        // get next page?
        if (json.next) {
          return dispatch('getWalletAssets', { address, cursor: json.next })
        }

        // return my aggregated assets list
        return state.myAssets
      } catch (e) {
        console.error(e)
      }
    },

    async getSourceAsset ({ state, commit, dispatch }, { contractAddress, tokenId }) {
      try {
        // saved?
        const saved = state.sourceAssets[contractAddress + '_' + tokenId]
        if (saved) return saved

        let asset = await dispatch('fetchFromOpenSea', { path: `/api/v1/asset/${contractAddress}/${tokenId}` }, { root: true })

        if (asset) {
          // console.log({ asset })

          // filter data
          asset = {
            name: asset.name,
            collectionName: asset.collection.name === 'Folia' ? 'Emoji Script' : asset.collection.name,
            image: { preview: asset.image_preview_url }
            // permalink: asset.permalink
          }

          commit('SAVE_SOURCE_ASSET', { contractAddress, tokenId, asset })
        }

        return asset
      } catch (e) {
        console.error(e)
        throw e
      }
    }
  }
}
