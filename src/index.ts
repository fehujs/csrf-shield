import { Request, Response, types as FHSTypes } from "@fehujs/http-server"

import { CONFIG } from "./config"
import { generateToken, setCsrfCookie } from "./helpers"
import { CsrfMiddleware } from "./middleware"


type HttpContext = FHSTypes.HttpContext

declare module "@fehujs/http-server" {
    interface Response {
        generateCsrfToken: (request: Request) => string
        setCsrfCookie: (httpContext: HttpContext, token: string) => Response
        setCsrfHeader: (httpContext: HttpContext, token: string) => Response
        csrfHTMLInput: (token: string) => string
    }
}

Response.prototype.generateCsrfToken = function (request: Request) {
    const session_id = request.cookieHandler.getCookie(CONFIG.modules.sessions.ID_COOKIE_NAME)
    return generateToken(session_id)
}

Response.prototype.setCsrfCookie = function (httpContext: HttpContext, token: string) {
    return setCsrfCookie(httpContext, token)
}

Response.prototype.setCsrfHeader = function ({ response }: HttpContext, token: string) {
    response.setHeader(CONFIG.modules.csrfShield.TOKEN_HEADER_NAME, token)
    return response
}

Response.prototype.csrfHTMLInput = function (token: string) {
    return `<input name="${CONFIG.modules.csrfShield.TOKEN_BODY_NAME}" type="hidden" value="${token}" />`
}

type CsrfShieldConfig = {
    TOKEN_COOKIE_NAME: string
    TOKEN_HEADER_NAME: string
    TOKEN_BODY_NAME: string
    TOKEN_EXPIRES: number
}

export {
    CsrfMiddleware,
    CsrfShieldConfig,
    generateToken,
    setCsrfCookie,
}
