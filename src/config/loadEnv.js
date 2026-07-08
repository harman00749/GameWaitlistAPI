import fs from 'node:fs'
import path from 'node:path'

const envPath = path.join(process.cwd(), '.env')

if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8')

  envFile.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim()

    if (!trimmedLine || trimmedLine.startsWith('#')) {
      return
    }

    const separatorIndex = trimmedLine.indexOf('=')

    if (separatorIndex === -1) {
      return
    }

    const key = trimmedLine.slice(0, separatorIndex).trim()
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, '')

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  })
}
