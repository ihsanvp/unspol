import Router from "@koa/router"
import Koa from "koa"
import cors from "@koa/cors"
import UploadRouter from "./uploader/router"
import { UPLOADS_DIR, UPLOADS_TEMP_DIR } from "./constants"
import ensureDirectory from "./utils/ensureDirectory"
import { add } from "koa-tus-server"

ensureDirectory(UPLOADS_DIR)
ensureDirectory(UPLOADS_TEMP_DIR)

const app = new Koa()
const router = new Router()

app.use(cors())

router.get("/", async (ctx) => {
    ctx.body = {
        msg: "Hello",
        result: add(1, 2)
    }
})

router.use("/uploads", UploadRouter.routes(), UploadRouter.allowedMethods())

app.use(router.routes())
app.use(router.allowedMethods())

export function startServer(port: number) {
    app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`)
    })
}