import Straylight from '../contracts/Straylight'
import networks from '../src/networks'
import ethers from 'ethers'
import Jimp from 'jimp'

export async function handler (event, context) {
  try {
    const path = event.path.split('/')
    const chainId = path[path.length - 2]
    const boardId = path[path.length - 1].split('.')[0]
    
    const deployAddress = Straylight.networks[chainId]?.address
    
    if (!deployAddress || !networks[chainId]?.infura) {
      throw new Error(`no contract on chain: ${chainId}`)
    }

    const provider = new ethers.getDefaultProvider(networks[chainId].infura)
    const contract = new ethers.Contract(deployAddress, Straylight.abi, provider)
    
    const timeId = `get image (chain: ${chainId}, boardid: ${boardId})`
    console.time(timeId)
    const boardImageData = await contract.renderBoard(boardId)
    console.timeEnd(timeId)

    console.time(timeId + '__PNG')
    const base64 = boardImageData.split(',').pop()
    const svgString = Buffer.from(base64, 'base64').toString('binary')
    
    // extract bmp string
    const reg = /(?:\(['"]?)(.*?)(?:['"]?\))/
    const bmpString = reg.exec(svgString)[1].split(',').pop()

    // convert to png for og:image
    let image = await Jimp.read(Buffer.from(bmpString, 'base64'))
    image = image.resize(144 * 8,144 * 8, Jimp.RESIZE_NEAREST_NEIGHBOR)
    const png = await image.getBufferAsync('image/png')
    console.timeEnd(timeId + '__PNG')
    
  
    return {
      statusCode: 200,
      isBase64Encoded: true,
      body: png.toString('base64'),
      headers: {
        'Content-Type': 'image/png'
      }
    }
  } catch (e) {
    console.error(e)
    
    return {
      statusCode: 500,
      body: e.message
    }
  }
}