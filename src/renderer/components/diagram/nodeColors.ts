export const NODE_COLORS = {
  'node-blue':   { base: '#5B8CFF', intense: '#2D5FE0', gradient: 'linear-gradient(135deg, #5B8CFF44 0%, #5B8CFF22 100%)' },
  'node-teal':   { base: '#4FC3C7', intense: '#2A9EA3', gradient: 'linear-gradient(135deg, #4FC3C744 0%, #4FC3C722 100%)' },
  'node-purple': { base: '#A78BFA', intense: '#7C55F5', gradient: 'linear-gradient(135deg, #A78BFA44 0%, #A78BFA22 100%)' },
  'node-green':  { base: '#6EDC8C', intense: '#3DBF62', gradient: 'linear-gradient(135deg, #6EDC8C44 0%, #6EDC8C22 100%)' },
  'node-yellow': { base: '#F6C85F', intense: '#E0A020', gradient: 'linear-gradient(135deg, #F6C85F44 0%, #F6C85F22 100%)' },
} as const

export type NodeColorKey = keyof typeof NODE_COLORS

export function getNodeColor(id: string): NodeColorKey {
  const keys = Object.keys(NODE_COLORS) as NodeColorKey[]
  const index = id
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return keys[index % keys.length]
}