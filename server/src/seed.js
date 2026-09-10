import { runSeed } from './products.js'

const force = process.argv.includes('--force')
const result = runSeed(force)
console.log(result.message)
process.exit(0)