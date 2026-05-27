import mongoose from "mongoose"
import userModel from "../models/userModel.js"
import transactionModel from "../models/transaction.model.js";

export const transferMoney = async(req,res) => {
    // 1. Session start karo (Rough copy kholo)
    const session = mongoose.startSession();

    // 2. Transaction start karo (Rule set karo: All or Nothing)
    (await session).startTransaction();

    try {
        const senderId = req.user.id;
        const {receiverId, amount} = req.body;

        if(!receiverId || !amount){
            return res.status(400).json({message:"receiverId and amount are required"})
        }

        // 3. Sender ko dhundo
        const sender = userModel.findById(senderId).session(session)
        if(!sender){
            throw new Error("Sender not found!")
        }

        if(sender.balance < amount){
            throw new Error("Insufficient amount!");
        }

        //receiver ko dhundo
        const receiver = userModel.findById(receiverId).session(session);
        if(!receiver){
            throw new Error("Receiver not found")
        }

        // 6. Maths calculation: Sender se kaato, Receiver ko do
        sender.balance -= amount;
        receiver.balance += Number(amount);

        // 7. Dono ko save karo (Rough copy mein
        sender.save({session});
        receiver.save({session});

        // 8. Transaction ki entry create karo history ke liye
        await transactionModel.create(
            [{sender:senderId, receiver:receiverId, amount:amount, status:"success"}],
            {session}
        )

        // 9. SAB KUCH THEEK HAI! Ab finally fair copy (Database) mein save kar do.
        (await session).commitTransaction();

        res.status(200).json({
            message:"Money Transfer successfully!",
            remainingBalance:sender.balance
        })

    }catch (error) {
        console.log("Transaction Failed, Rollback Executed:", error.message);
        
        return res.status(400).json({ 
            message: "Transaction failed!", 
            error: error.message 
        });
    }finally {
        // Kaam pura ho ya fail ho, rough copy ka page band (end) karna zaroori hai memory bachane ke liye
        session.endSession();
    }
}

