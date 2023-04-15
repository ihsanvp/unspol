import { TusStorage } from "./base.storage";
import fs from "fs/promises"
import fsSync from "fs"
import http from "http"
import stream from "stream"
import path from "path"

interface DiskStorageOptions {
    root: string
}

export default class DiskStorage implements TusStorage {
    root: string

    constructor(opts: DiskStorageOptions) {
        if (!fsSync.existsSync(opts.root)) {
            fsSync.mkdirSync(opts.root, { recursive: true })
        }

        this.root = opts.root
    }

    async create(name: string) {
        const location = path.join(this.root, name)
        const f = await fs.open(location, "w")
        await f.close()

        return location
    }

    async append(path: string, data: any) {
        await fs.appendFile(path, data)
    }

    async write(readable: http.IncomingMessage | stream.Readable, id: string, offset: number) {
        const location = path.join(this.root, id)
        const writeable = fsSync.createWriteStream(location, {
            flags: "r+",
            start: offset
        })

        let bytes_received = 0
        const transform = new stream.Transform({
            transform(chunk, _, callback) {
                bytes_received += chunk.length
                callback(null, chunk)
            },
        })

        return new Promise((resolve, reject) => {
            stream.pipeline(readable, transform, writeable, (err) => {
                if (err) {
                    reject(err)
                }
                return resolve(offset + bytes_received)
            })
        }) as Promise<number>
    }
}