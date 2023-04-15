import Koa from "koa"
import KoaRouter from "koa-router"

const app = new Koa()
const router = new KoaRouter()

router.get("/", async (ctx, next) => {
    ctx.body = {
        msg: "Hello"
    }
})

// Routes
app.use(router.routes()).use(router.allowedMethods())

export function startServer(port: number) {
    app.listen(port, () => {
        console.log(`App listening on http://localhost:${port}`)
    })
}