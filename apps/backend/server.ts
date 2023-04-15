import { startServer } from "./app";

const PORT = parseInt(process.env.PORT || "8000")

startServer(PORT)