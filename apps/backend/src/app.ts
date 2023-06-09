import Router from "@koa/router"
import Koa from "koa"
import cors from "@koa/cors"
import { UPLOADS_DIR, UPLOADS_TEMP_DIR } from "./constants"
import { DiskStorage, RedisBackend, TusServer } from "koa-tus-server"

const app = new Koa()
const router = new Router()
const tusServer = new TusServer({
    max_upload_size: 10 * 1024 * 1024 * 1024, // 10 GB
    backend: new RedisBackend({
        url: "redis://localhost:6379"
    }),
    storage: new DiskStorage({
        root: UPLOADS_DIR
    })
})

app.use(cors({
    allowMethods: [
        "GET",
        "POST",
        "PUT",
        "PATCH",
        "DELETE",
        "HEAD",
        "OPTIONS"
    ],
    allowHeaders: [
        "Authorization",
        "X-Requested-With",
        "X-Request-ID",
        "X-HTTP-Method-Override",
        "Upload-Length",
        "Upload-Offset",
        "Tus-Resumable",
        "Upload-Metadata",
        "Upload-Defer-Length",
        "Upload-Concat",
        "User-Agent",
        "Referrer",
        "Origin",
        "Content-Type",
        "Content-Length"
    ],
    exposeHeaders: [
        "Upload-Offset",
        "Location",
        "Upload-Length",
        "Tus-Version",
        "Tus-Resumable",
        "Tus-Max-Size",
        "Tus-Extension",
        "Upload-Metadata",
        "Upload-Defer-Length",
        "Upload-Concat",
        "Location",
        "Upload-Offset",
        "Upload-Length"
    ]
}))

router.get("/", async (ctx) => {
    ctx.body = {
        msg: "Hello",
    }
})

// router.use("/uploads", UploadRouter.routes(), UploadRouter.allowedMethods())
router.use("/uploads", tusServer.router.routes(), tusServer.router.allowedMethods())

app.use(router.routes())
app.use(router.allowedMethods())

export function startServer(port: number) {
    app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`)
    })
}