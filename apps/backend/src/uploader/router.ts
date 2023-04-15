import Router from "@koa/router";
import bodyParser from "koa-bodyparser";
import { v4 as uuid } from "uuid"
import path from "path"
import { body, validationResults } from "koa-req-validation"
import { UPLOADS_TEMP_DIR } from "../constants";
import redis from "../utils/redis";
import fs from "fs/promises"

const UploadRouter = new Router()

UploadRouter.use(bodyParser())

interface UploadRequestBody {
    name: string
    size: number
    mime: string
}

UploadRouter.post("/",
    body("name").build(),
    body("size").isInt().toInt().build(),
    body("mime").isMimeType().build(),
    async (ctx) => {
        const validations = validationResults(ctx)

        if (validations.hasErrors()) {
            ctx.throw(400, JSON.stringify(validations.mapped()))
        }

        const data = ctx.request.body as UploadRequestBody

        const id = uuid()
        const location = path.join(UPLOADS_TEMP_DIR, data.name)

        await redis.connect()
        await redis.set(id, JSON.stringify({ ...data, location }))
        await redis.disconnect()

        // Create file
        await (await fs.open(location, "w")).close()

        ctx.body = {
            id,
            location
        }
    }
)

UploadRouter.patch("/:id", async (ctx) => {
    const id = ctx.params.id

    await redis.connect()
    const result = await redis.get(id)
    await redis.disconnect()

    if (!result) {
        ctx.throw(400, "Invalid id")
    }

    const metadata = JSON.parse(result)

    console.log(ctx.request.body)

    ctx.body = {
        msg: "ok",
        metadata
    }
})

export default UploadRouter