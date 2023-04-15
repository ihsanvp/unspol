import { TusStorage } from "./base.storage";
import fs from "fs/promises"
import fsSync from "fs"
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

    async create(id: string) {
        const location = path.join(this.root, id)
        const f = await fs.open(location, "w")
        await f.close()

        return location
    }
}