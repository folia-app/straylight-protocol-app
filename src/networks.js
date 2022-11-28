const infuraProjectID = import.meta.env?.VITE_APP_INFURA_PROJECT_ID || process.env.VITE_APP_INFURA_PROJECT_ID

export default {
  1: {
    name: 'ethereum',
    layer: 'ethereum',
    infura: `https://mainnet.infura.io/v3/${infuraProjectID}`,
    explorer: { name: 'Etherscan', domain: 'https://etherscan.io' },
    marketplace: { name: 'OpenSea', domain: 'https://opensea.io', assetPath: '/assets/ethereum'}
  },
  5: {
    name: 'goerli',
    layer: 'ethereum',
    infura: `https://goerli.infura.io/v3/${infuraProjectID}`,
    explorer: {
      name: 'Etherscan',
      domain: 'https://goerli.etherscan.io' },
    marketplace: {
      name: 'OpenSea',
      domain: 'https://testnets.opensea.io',
      assetPath: '/assets/goerli'
    },
    chainInfo: {
      chainId: 5,
      chainName: 'Goerli',
      rpcUrls: ['https://eth-goerli.public.blastapi.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
    }
  },
  10: {
    name: 'optimism',
    layer: 'optimism',
    infura: `https://optimism-mainnet.infura.io/v3/${infuraProjectID}`,
    explorer: {
      name: 'Etherscan',
      domain: 'https://blockscout.com/optimism/goerli'
    },
    marketplace: {
      name: 'Quixotic',
      domain: 'https://quixotic.io',
      assetPath: '/asset'
    },
    chainInfo: {
      chainId: 10,
      chainName: 'Optimism',
      rpcUrls: ['https://mainnet.optimism.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      },
      blockExplorerUrls: ['https://optimistic.etherscan.io']
    }
  },
  420: {
    name: 'optimism-goerli',
    layer: 'optimism',
    infura: `https://optimism-goerli.infura.io/v3/${infuraProjectID}`,
    explorer: {
      name: 'Etherscan',
      domain: 'https://blockscout.com/optimism/goerli'
    },
    marketplace: { name: 'Quixotic',
      domain: 'https://goerli.quixotic.io',
      assetPath: '/asset'
    },
    chainInfo: {
      chainId: 420,
      chainName: 'Optimism Goerli Testnet',
      rpcUrls: ['https://goerli.optimism.io'],
      nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18,
      }
      // blockExplorerUrls: []
    }
  }
}