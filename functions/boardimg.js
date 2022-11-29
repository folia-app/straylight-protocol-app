import Straylight from '../contracts/Straylight'
import networks from '../src/networks'
import ethers from 'ethers'
import Jimp from 'jimp'

export async function handler (event, context) {
  try {
    const path = event.path.split('/')
    const chainId = path[path.length - 2]
    // parse boardId from last part ("/1", "1.png", "/1_3333.png")
    const boardId = path[path.length - 1].split('.')[0].split('_')[0]
    
    // size (default is social share size)
    let size = event.queryStringParameters.width || 144 * 8
    size = Number(size)
    
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
    if (size !== 144) {
      image = image.resize(size,size, Jimp.RESIZE_NEAREST_NEIGHBOR)
    }
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