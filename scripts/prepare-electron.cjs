const fs = require('node:fs')
const path = require('node:path')

const distElectronDir = path.join(process.cwd(), 'dist-electron')
const distMainDir = path.join(distElectronDir, 'main')
const distPreloadDir = path.join(distElectronDir, 'preload')

for (const dir of [distElectronDir, distMainDir, distPreloadDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

const commonJsPkg = JSON.stringify({ type: 'commonjs' }, null, 2)

fs.writeFileSync(path.join(distElectronDir, 'package.json'), commonJsPkg, 'utf-8')
fs.writeFileSync(path.join(distMainDir, 'package.json'), commonJsPkg, 'utf-8')
fs.writeFileSync(path.join(distPreloadDir, 'package.json'), commonJsPkg, 'utf-8')

console.log('[prepare-electron] package.json commonjs creado en dist-electron, main y preload')