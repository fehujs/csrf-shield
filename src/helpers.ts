import { createHmac } from "crypto"

import { HttpContext, Response } from "@fehujs/http-server"

import { CONFIG } from "./config"


export function generateToken(sessionId: string) {
    return createHmac('sha256', CONFIG.secret_key).update(sessionId).digest('hex')
}

export function setCsrfCookie({ request, response }: HttpContext, token: string): Response {
    return request.cookieHandler.setCookie(response, {
        name: CONFIG.TOKEN_COOKIE_NAME,
        value: token,
        secure: true,
        sameSite: "Strict",
        httpOnly: true,
        maxAge: CONFIG.TOKEN_COOKIE_EXPIRES
    })
}
