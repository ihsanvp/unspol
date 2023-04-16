import http from "http"
import stream from "stream"

export interface TusStorage {
    create: (name: string) => Promise<string>
    append: (path: string, data: any) => Promise<void>
    write: (readable: http.IncomingMessage | stream.Readable, id: string, offset: number) => Promise<number>
    rename: (id: string, name: string) => Promise<string>
}