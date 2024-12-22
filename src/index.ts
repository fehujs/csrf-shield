import { HttpContext, Request, Response } from "@fehujs/http-server"
import { getSessionId } from "@fehujs/sessions"

import { CONFIG } from "./config"
import { generateToken, setCsrfCookie } from "./helpers"
import { CsrfMiddleware } from "./middleware"


declare module "@fehujs/http-server" {
    interface Response {
        generateCsrfToken: (request: Request) => string
        setCsrfCookie: (httpContext: HttpContext, token: string) => Response
        setCsrfHeader: (httpContext: HttpContext, token: string) => Response
        csrfHTMLInput: (token: string) => string
    }
}

Response.prototype.generateCsrfToken = function (request: Request) {
    const session_id = getSessionId(request)
    return generateToken(session_id)
}

Response.prototype.setCsrfCookie = function (httpContext: HttpContext, token: string) {
    return setCsrfCookie(httpContext, token)
}

Response.prototype.setCsrfHeader = function ({ response }: HttpContext, token: string) {
    response.setHeader(CONFIG.TOKEN_HEADER_NAME, token)
    return response
}

Response.prototype.csrfHTMLInput = function (token: string) {
    return `<input name="${CONFIG.TOKEN_BODY_NAME}" type="hidden" value="${token}" />`
}

type CsrfShieldConfig = {
    TOKEN_COOKIE_NAME: string
    TOKEN_HEADER_NAME: string
    TOKEN_BODY_NAME: string
    TOKEN_EXPIRES: number
}

export {
    CONFIG,
    CsrfMiddleware,
    CsrfShieldConfig,
    generateToken,
    setCsrfCookie,
}
