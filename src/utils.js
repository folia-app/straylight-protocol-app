export function turmiteName (tokenId) {
  return `turmite_${tokenId}`
  // first turmite is W, ...
  // const labels = ['W', 'S', 'N', 'E']
  // const position = tokenId % 4
  // return ${labels[position]}`
}

// object fit helpers
function getRenderedSize (contains, cWidth, cHeight, width, height, pos){
  var oRatio = width / height,
      cRatio = cWidth / cHeight;
  return function() {
    if (contains ? (oRatio > cRatio) : (oRatio < cRatio)) {
      this.width = cWidth;
      this.height = cWidth / oRatio;
    } else {
      this.width = cHeight * oRatio;
      this.height = cHeight;
    }      
    this.left = (cWidth - this.width)*(pos/100);
    this.right = this.width + this.left;
    return this;
  }.call({});
}

export function getImgSizeInfo (img) {
  var pos = window.getComputedStyle(img).getPropertyValue('object-position').split(' ');
  return getRenderedSize(true,
                         img.width,
                         img.height,
                         img.naturalWidth,
                         img.naturalHeight,
                         parseInt(pos[0]));
}
