export interface TusStorage {
    create: (id: string) => Promise<string>
}