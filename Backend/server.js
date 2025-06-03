import express from 'express'
import dotenv from 'dotenv'
import { sql } from './config/db.js';

dotenv.config()

const app = express();

const port = process.env.PORT

async function connnectDB() {
    try {
        await sql`
        CREATE TABLE IF NOT EXISTS transactions()
        `
    } catch (error) {
        log
    }
}

app.get("/", (req, res) => {
    res.send("Its working fine")
})

app.listen(port, () => {
    console.log("Server is running on port:", port);
    
})