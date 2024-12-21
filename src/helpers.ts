import { createHmac } from "crypto"

import { Response, types } from "@fehujs/http-server"

import { CONFIG } from "./config"


export function generateToken(sessionId: string) {
    return createHmac('sha256', CONFIG.SECRET_KEY).update(sessionId).digest('hex')
}

export function setCsrfCookie({ request, response }: types.HttpContext, token: string): Response {
    return request.cookieHandler.setCookie(response, {
        name: CONFIG.modules.csrfShield.TOKEN_COOKIE_NAME,
        value: token,
        secure: true,
        sameSite: "Strict",
        httpOnly: true,
        maxAge: CONFIG.modules.csrfShield.TOKEN_COOKIE_EXPIRES
    })
}