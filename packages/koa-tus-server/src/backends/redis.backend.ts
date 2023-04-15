import { BackendData, TusBackend } from "./base.backend";
import { createClient, RedisClientType } from "redis"

interface RedisBackendOptions {
    url: string
}

export default class RedisBackend implements TusBackend {
    client: RedisClientType

    constructor({ url }: RedisBackendOptions) {
        this.client = createClient({
            url
        })

        // Check if redis is running and ready to connect
        this.client.connect().then(() => this.client.disconnect().then(() => console.log("Redis Connection Available!"))).catch(() => console.log("Failed to connect to Redis"))
    }

    async get(key: string) {
        await this.client.connect()
        const result = await this.client.get(key)
        await this.client.disconnect()

        if (!result) {
            return null
        }

        return JSON.parse(result)
    }

    async set(key: string, data: BackendData) {
        await this.client.connect()
        await this.client.set(key, JSON.stringify(data))
        await this.client.disconnect()
    }

    async update(key: string, data: BackendData) {
        await this.set(key, data)
    }
}