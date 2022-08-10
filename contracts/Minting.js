// joined from paul's starylight repo
export default {
  "networks": {
    // 69: {
    //   "address": "0x3cF2D51787Ca95E4b6917B3EDDDBd9f72A3D75Ca"
    // }
    // goerli
    420: {
      "address": "0xb81a153a006F6e3709DBB0bDFa04cAcf6D805C48"
    }
  },
  "abi": [
    {
      "type": "constructor",
      "stateMutability": "nonpayable",
      "inputs": [
        {
          "type": "address[]",
          "name": "payees",
          "internalType": "address[]"
        },
        {
          "type": "uint256[]",
          "name": "shares_",
          "internalType": "uint256[]"
        }
      ]
    },
    {
      "type": "event",
      "name": "ERC20PaymentReleased",
      "inputs": [
        {
          "type": "address",
          "name": "token",
          "internalType": "contract IERC20",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "internalType": "address",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "OwnershipTransferred",
      "inputs": [
        {
          "type": "address",
          "name": "previousOwner",
          "internalType": "address",
          "indexed": true
        },
        {
          "type": "address",
          "name": "newOwner",
          "internalType": "address",
          "indexed": true
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PayeeAdded",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "shares",
          "internalType": "uint256",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PaymentReceived",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "internalType": "address",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "PaymentReleased",
      "inputs": [
        {
          "type": "address",
          "name": "to",
          "internalType": "address",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "internalType": "uint256",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "mint",
      "inputs": [
        {
          "type": "address",
          "name": "addr",
          "internalType": "address",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "mintPrice",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "name": "owner",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        }
      ],
      "name": "payee",
      "inputs": [
        {
          "type": "uint256",
          "name": "index",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "payable",
      "outputs": [],
      "name": "publicMint",
      "inputs": [
        {
          "type": "bytes12",
          "name": "rule",
          "internalType": "bytes12"
        },
        {
          "type": "uint256",
          "name": "moves",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "release",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address payable"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "release",
      "inputs": [
        {
          "type": "address",
          "name": "token",
          "internalType": "contract IERC20"
        },
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "released",
      "inputs": [
        {
          "type": "address",
          "name": "token",
          "internalType": "contract IERC20"
        },
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "released",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "renounceOwnership",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "setStraylight",
      "inputs": [
        {
          "type": "address",
          "name": "straylight",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "shares",
      "inputs": [
        {
          "type": "address",
          "name": "account",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "totalReleased",
      "inputs": [
        {
          "type": "address",
          "name": "token",
          "internalType": "contract IERC20"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "totalReleased",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "totalShares",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "transferOwnership",
      "inputs": [
        {
          "type": "address",
          "name": "newOwner",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "receive",
      "stateMutability": "payable"
    }
  ]
}