import { rpcsFor } from './rpc'

// No API key. Each chain's url is the head of the redundant keyless pool in
// ./rpc; code that needs failover should use that module directly rather than
// this single value.

export default {
  1: {
    name: 'ethereum',
    layer: 'ethereum',
    rpc: rpcsFor(1)[0],
    explorer: { name: 'Etherscan', domain: 'https://etherscan.io' },
    marketplace: { name: 'OpenSea', domain: 'https://opensea.io', assetPath: '/assets/ethereum'},
    movesMax: 4000
  },
  5: {
    name: 'goerli',
    layer: 'ethereum',
    rpc: rpcsFor(5)[0],
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
    },
    movesMax: 4000
  },
  10: {
    name: 'optimism',
    layer: 'optimism',
    rpc: rpcsFor(10)[0],
    explorer: {
      name: 'Etherscan',
      domain: 'https://optimistic.etherscan.io'
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
    },
    movesMax: 6000
  },
  420: {
    name: 'optimism-goerli',
    layer: 'optimism',
    rpc: rpcsFor(420)[0],
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
    },
    movesMax: 6000
  }
}