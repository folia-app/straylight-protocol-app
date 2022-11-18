// joined from paul's starylight repo
export default {
  "networks": {
    // 69: {
    //   "address": "0x3cF2D51787Ca95E4b6917B3EDDDBd9f72A3D75Ca"
    // }
    // goerli
    5: {
      "address": "0xEEd6D1426c153965FDc3434bA1A5acDfc615e42B",
    },
    // optimism goerli
    420: {
      "address": "0x2A89833a10763aa0C9cA08175F7a6F6e14AD2dCF",
    }
  },
  "abi": [
    {
      "type": "constructor",
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
        },
        {
          "type": "uint256",
          "name": "newMintPrice",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "adminMint",
      "inputs": [
        {
          "type": "address",
          "name": "mintTo",
          "internalType": "address"
        },
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
      "stateMutability": "view",
      "outputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "contract interfaceStraylight"
        }
      ],
      "name": "istraylight",
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
          "type": "address",
          "name": "mintTo",
          "internalType": "address"
        },
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
          "name": "_straylight",
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
      "type": "event",
      "name": "ERC20PaymentReleased",
      "inputs": [
        {
          "type": "address",
          "name": "token",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Mint",
      "inputs": [
        {
          "type": "address",
          "name": "addr",
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
          "indexed": true
        },
        {
          "type": "address",
          "name": "newOwner",
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
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "shares",
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
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
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
          "indexed": false
        },
        {
          "type": "uint256",
          "name": "amount",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "receive"
    }
  ]
}