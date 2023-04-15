import Router from "@koa/router";
import { TusBackend } from "./backends/base.backend";
import { v4 } from "uuid";
import { TusStorage } from "./storages/base.storage";
import UrlUtils from "./utils/url";

function decodeMetadata(content: string) {
    return Object.fromEntries(content.split(",").map(field => {
        const [key, value] = field.split(" ")
        return [key, Buffer.from(value, "base64").toString()]
    }))
}

interface TusServerOptions {
    backend: TusBackend
    storage: TusStorage
    max_upload_size: number
}

export default class TusServer {
    backend: TusBackend
    storage: TusStorage
    router: Router
    max_upload_size: number
    tus_version: string
    extensions: string[]

    constructor(opts: TusServerOptions) {
        this.tus_version = "1.0.0"
        this.extensions = ["creation"]
        this.max_upload_size = opts.max_upload_size

        this.backend = opts.backend
        this.storage = opts.storage

        this.router = new Router()

        this.registerRoutes()
    }

    registerRoutes() {
        // OPTIONS /
        this.router.options("/", async (ctx) => {
            ctx.set("Tus-Resumable", this.tus_version)
            ctx.set("Tus-Version", this.tus_version)
            ctx.set("Tus-Extension", this.extensions)
            ctx.set("Tus-Max-Size", this.max_upload_size.toString())

            ctx.status = 204
        })

        // POST /
        this.router.post("/", async (ctx) => {
            const length = parseInt(ctx.get("Content-Length"))
            const size = parseInt(ctx.get("Upload-Length"))
            const metadata = decodeMetadata(ctx.get("Upload-Metadata"))
            const id = v4()
            const location = await this.storage.create(id)
            const url = UrlUtils.buildAbsoluteUri(ctx, id)

            await this.backend.set(id, {
                offset: 0,
                name: metadata.name,
                mime: metadata.type,
                url,
                size,
                location
            })

            ctx.set("Location", url)
            ctx.set("Tus-Resumable", this.tus_version)
        })
    }
}