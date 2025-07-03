import express from 'express'
import dotenv from 'dotenv'
import { initDB, sql } from './src/config/db.js';

dotenv.config()

const app = express();

app.use(express.json())

const port = process.env.PORT



app.get("/", (req, res) => {
    res.send("Its working fine")
})



app.get("/api/transactions/:userId", async (req, res) => {

    try {
        const { userId } = req.params

        if (!userId) {
            return res.status(400).json({message: "User not found"})
        }

        // console.log(userId);
        

        const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId}
        `        
        return res.status(200).json(transactions)

    } catch (error) {
        console.log("Error getting the transactions", error);
        return res.status(500).json({ message: "Internal server error" })
    }
})


app.post("/api/transactions", async (req, res) => {
    try {
        const { user_id, title, amount, category } = req.body

        if (!user_id || !title || amount === undefined || !category) {
            return res.status(400).json({ message: "All fields is required" })
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id, title, amount, category)
        VALUES (${user_id}, ${title}, ${amount}, ${category})
        RETURNING *
        `

        return res.status(200).json(transaction)

    } catch (error) {
        console.log("Error creating transaction", error);
        return res.status(500).json({ message: "Internal server error" })
    }
})


app.delete("/api/transactions/:id", async(req, res) => {
    try {
        const { id } = req.params

        const deletedTransaction = await sql`
        DELETE FROM transactions WHERE id = ${id} RETURNING *
        `

        // console.log(deletedTransaction);
        

        if(deletedTransaction.length === 0){
            return res.status(404).json({message: "Transaction not found"})
        }

        return res.status(200).json({message: "Transaction deleted"})


    } catch (error) {
        console.log("Error deleting transaction", error);
        return res.status(500).json({message: "Internal server error"})
        
    }
})


initDB().then(() => {

    app.listen(port, () => {
        console.log("Server is running on port:", port);

    })
})