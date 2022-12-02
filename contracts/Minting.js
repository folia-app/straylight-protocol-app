// joined from paul's starylight repo
export default {
  "networks": {
    // ethereum
    1: {
      "address": "0xe0b14d9412f762b6a49e7d009b62daed70212788",
    },
    // optimism
    10: {
      "address": "0xb955c66FF031cEA247ff22bE1fDBeAE23977d9d7",
    },
    // goerli
    5: {
      "address": "0x1De6276b73B5a5F41FdC7C239b0c9CECFEFF6B6c",
    },
    // optimism goerli
    420: {
      "address": "0xa4311c666BedBB73577F1A2a2D850Af5024589b2",
    }
  },
  "abi": [
    {
      "inputs": [
        {
          "internalType": "address[]",
          "name": "payees",
          "type": "address[]"
        },
        {
          "internalType": "uint256",
          "name": "_percentage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_MintPrice",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "Mint",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "mintTo",
          "type": "address"
        },
        {
          "internalType": "bytes12",
          "name": "rule",
          "type": "bytes12"
        },
        {
          "internalType": "uint256",
          "name": "moves",
          "type": "uint256"
        }
      ],
      "name": "adminMint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "istraylight",
      "outputs": [
        {
          "internalType": "contract interfaceStraylight",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mintPrice",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "mintTo",
          "type": "address"
        },
        {
          "internalType": "bytes12",
          "name": "rule",
          "type": "bytes12"
        },
        {
          "internalType": "uint256",
          "name": "moves",
          "type": "uint256"
        }
      ],
      "name": "publicMint",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_straylight",
          "type": "address"
        }
      ],
      "name": "setStraylight",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
}