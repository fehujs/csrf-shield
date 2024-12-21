import { config } from "dotenv"
import { cwd } from "process"

const conf = config()

if (conf.error) {
    throw conf.error
}

if (!conf.parsed) {
    throw Error("[environment]: .env file not found.")
}

if (!conf.parsed["SECRET_KEY"]) {
    throw Error("[environment]: 'SECRET_KEY' not set.")
}

let _config
try {
    _config = await import(cwd() + "/config/csrf-shield.js")
} catch (e: any) {
    console.log(`[csrf-token] config: config file not found, applying default config.`)
    _config = {
        TOKEN_COOKIE_NAME: "csrf_token",
        TOKEN_HEADER_NAME: "x-csrf-token",
        TOKEN_BODY_NAME: "_token",
        TOKEN_EXPIRES: "300000",
    }
}

export const CONFIG = { ..._config, secret_key: conf.parsed["SECRET_KEY"] }
