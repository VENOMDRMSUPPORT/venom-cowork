import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const appDir = path.resolve(__dirname, "..")
const sourceDir = path.join(appDir, "src", "models")
const outputPath = path.join(appDir, "models-site", "models", "api.json")

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"))
}

const isDevMode = process.env.VENOMCOWORK_DEV_MODE === "1"
const base = await readJson(path.join(sourceDir, "base.json"))
const venomcowork = await readJson(path.join(sourceDir, isDevMode ? "venomcowork-dev.json" : "venomcowork-prod.json"))
const models = { ...base, ...venomcowork }

await mkdir(path.dirname(outputPath), { recursive: true })
await writeFile(outputPath, `${JSON.stringify(models)}\n`)

console.log(`[inference] generated ${path.relative(appDir, outputPath)} (${isDevMode ? "dev" : "prod"})`)
