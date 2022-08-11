export function turmiteName (tokenId) {
  // first turmite is W, ...
  const labels = ['W', 'S', 'N', 'E']
  const position = tokenId % 4
  return `turmite_${labels[position]}`
}
