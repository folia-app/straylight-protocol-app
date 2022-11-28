import Straylight from '../contracts/Straylight'
import networks from '../src/networks'
import ethers from 'ethers'

export async function handler (event, context) {
  try {
    const path = event.path.split('/')
    const chainId = path[path.length - 2]
    const boardId = path[path.length - 1]
    
    const deployAddress = Straylight.networks[chainId]?.address
    
    if (!deployAddress || !networks[chainId]?.infura) {
      throw new Error(`no contract on chain: ${chainId}`)
    }

    const provider = new ethers.getDefaultProvider(networks[chainId].infura)
    const contract = new ethers.Contract(deployAddress, Straylight.abi, provider)
  
    const boardImageData = await contract.renderBoard(boardId)
    
    const base64 = boardImageData.split(',').pop()
  
    return {
      statusCode: 200,
      body: base64,
      isBase64Encoded: true,
      headers: {
        'Content-Type': 'image/svg+xml',
      },
    }
  } catch (e) {
    console.error(e)
    
    return {
      statusCode: 500,
      body: e.message
    }
  }
}