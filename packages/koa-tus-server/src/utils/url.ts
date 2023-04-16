import { RouterContext } from "@koa/router"

const UrlUtils = {
    buildAbsoluteUri(ctx: RouterContext, path: string = "") {
        const scheme = ctx.secure ? "https" : "http"

        return `${scheme}://${ctx.host}${ctx.path}${path}`
    }
}

export default UrlUtils