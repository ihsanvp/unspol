export interface BackendData {
    offset: number
    size: number
    url: string
    location: string
    name: string
    mime: string
}

export interface TusBackend {
    get: (key: string) => Promise<BackendData | null>,
    set: (key: string, data: BackendData) => Promise<void>,
    update: (key: string, data: BackendData) => Promise<void>,
}