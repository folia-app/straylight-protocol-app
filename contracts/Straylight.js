// joined from paul's starylight repo
export default {
  "networks": {
    // 69: {
    //   "address": "0x820226867468D5825f9D38e3Dd969A6a38e673E7"
    // }
    5: {
      "address": "0x06970FaE89bc54a42364D8889B43Aa93A91ff807",
      "blockNumber": 7965288
    },
    // optimism goerli
    420: {
      "address": "0x8dAaaB111b46B8e5eCB1584a8486De586E6B1b87",
      "blockNumber": 2734449
    }
  },
  "abi": [
    {
      "type": "constructor",
      "inputs": [
        {
          "type": "address",
          "name": "_minterContract",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "maxAmount",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "approve",
      "inputs": [
        {
          "type": "address",
          "name": "spender",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
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
      "name": "balanceOf",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
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
      "name": "boardcounter",
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
      "name": "getApproved",
      "inputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "bytes",
          "name": "",
          "internalType": "bytes"
        }
      ],
      "name": "getBitmap",
      "inputs": [
        {
          "type": "uint8",
          "name": "boardNumber",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "posx",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "posy",
          "internalType": "uint8"
        },
        {
          "type": "bool",
          "name": "renderTurmite",
          "internalType": "bool"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "name": "getBitmapBase64",
      "inputs": [
        {
          "type": "uint8",
          "name": "boardNumber",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "posx",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "posy",
          "internalType": "uint8"
        },
        {
          "type": "bool",
          "name": "renderTurmite",
          "internalType": "bool"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "bytes1",
          "name": "",
          "internalType": "bytes1"
        }
      ],
      "name": "getByte",
      "inputs": [
        {
          "type": "uint256",
          "name": "x",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "y",
          "internalType": "uint256"
        },
        {
          "type": "uint256",
          "name": "boardNumber",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "bytes",
          "name": "encodedData",
          "internalType": "bytes"
        }
      ],
      "name": "getPosField",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "name": "getSvg",
      "inputs": [
        {
          "type": "uint8",
          "name": "boardNumber",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "posx",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "posy",
          "internalType": "uint8"
        },
        {
          "type": "bool",
          "name": "renderTurmite",
          "internalType": "bool"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "name": "haecceity",
      "inputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "name": "isApprovedForAll",
      "inputs": [
        {
          "type": "address",
          "name": "",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "",
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
      "name": "maxnumbturmites",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "moveTurmite",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
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
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "name": "name",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "address",
          "name": "owner",
          "internalType": "address"
        }
      ],
      "name": "ownerOf",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "publicmint",
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
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "name": "renderBoard",
      "inputs": [
        {
          "type": "uint8",
          "name": "number",
          "internalType": "uint8"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "reprogrammTurmite",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        },
        {
          "type": "bytes12",
          "name": "rule",
          "internalType": "bytes12"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "safeTransferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "safeTransferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        },
        {
          "type": "bytes",
          "name": "data",
          "internalType": "bytes"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "setApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "operator",
          "internalType": "address"
        },
        {
          "type": "bool",
          "name": "approved",
          "internalType": "bool"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "setByteHaMode",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        },
        {
          "type": "bytes",
          "name": "data",
          "internalType": "bytes"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "setHaecceityContract",
      "inputs": [
        {
          "type": "address",
          "name": "_haecceityContract",
          "internalType": "address"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "setHaecceityMode",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "setPositionHaMode",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
        },
        {
          "type": "bytes",
          "name": "data",
          "internalType": "bytes"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "bool",
          "name": "",
          "internalType": "bool"
        }
      ],
      "name": "supportsInterface",
      "inputs": [
        {
          "type": "bytes4",
          "name": "interfaceId",
          "internalType": "bytes4"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "name": "symbol",
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
      "name": "tokenByIndex",
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
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ],
      "name": "tokenOfOwnerByIndex",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "index",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "string",
          "name": "",
          "internalType": "string"
        }
      ],
      "name": "tokenURI",
      "inputs": [
        {
          "type": "uint256",
          "name": "id",
          "internalType": "uint256"
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
      "name": "totalSupply",
      "inputs": []
    },
    {
      "type": "function",
      "stateMutability": "nonpayable",
      "outputs": [],
      "name": "transferFrom",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "internalType": "address"
        },
        {
          "type": "address",
          "name": "to",
          "internalType": "address"
        },
        {
          "type": "uint256",
          "name": "tokenId",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "view",
      "outputs": [
        {
          "type": "uint8",
          "name": "turposx",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "turposy",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "orientation",
          "internalType": "uint8"
        },
        {
          "type": "uint8",
          "name": "boardnumber",
          "internalType": "uint8"
        },
        {
          "type": "bytes1",
          "name": "state",
          "internalType": "bytes1"
        },
        {
          "type": "bytes12",
          "name": "rule",
          "internalType": "bytes12"
        }
      ],
      "name": "turmites",
      "inputs": [
        {
          "type": "uint256",
          "name": "",
          "internalType": "uint256"
        }
      ]
    },
    {
      "type": "function",
      "stateMutability": "pure",
      "outputs": [
        {
          "type": "bool",
          "name": "allowed",
          "internalType": "bool"
        }
      ],
      "name": "validateNewRule",
      "inputs": [
        {
          "type": "bytes12",
          "name": "rule",
          "internalType": "bytes12"
        }
      ]
    },
    {
      "type": "event",
      "name": "Approval",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "spender",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "id",
          "indexed": true
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "ApprovalForAll",
      "inputs": [
        {
          "type": "address",
          "name": "owner",
          "indexed": true
        },
        {
          "type": "address",
          "name": "operator",
          "indexed": true
        },
        {
          "type": "bool",
          "name": "approved",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "Transfer",
      "inputs": [
        {
          "type": "address",
          "name": "from",
          "indexed": true
        },
        {
          "type": "address",
          "name": "to",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "id",
          "indexed": true
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TurmiteMint",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "bytes12",
          "name": "rule",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "boardId",
          "indexed": false
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TurmiteMove",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "uint8",
          "name": "boardnumber",
          "indexed": true
        },
        {
          "type": "uint256",
          "name": "moves",
          "indexed": true
        }
      ],
      "anonymous": false
    },
    {
      "type": "event",
      "name": "TurmiteReprogramm",
      "inputs": [
        {
          "type": "uint256",
          "name": "tokenId",
          "indexed": true
        },
        {
          "type": "bytes12",
          "name": "newrule",
          "indexed": true
        }
      ],
      "anonymous": false
    }
  ]
}