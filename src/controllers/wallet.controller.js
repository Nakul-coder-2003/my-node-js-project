import mongoose from "mongoose"
import userModel from "../models/userModel.js"
import transactionModel from "../models/transaction.model.js"
import { sendApprovedEmail, sendCreditEmail, sendDebitEmail, sendMoneyRequestEmail, sendRejectedEmail } from "../services/email.js";

export const transferMoney = async(req,res) => {
    // 1. Session start karo (Rough copy kholo)
    const session = await mongoose.startSession();

    // 2. Transaction start karo (Rule set karo: All or Nothing)
    (await session).startTransaction();

    try {
        const senderId = req.user.id;
        // console.log(senderId)
        const {receiverId, amount} = req.body;
        // console.log(receiverId)

        if(!receiverId || !amount){
            return res.status(400).json({message:"receiverId and amount are required"})
        }

        // 3. Sender ko dhundo
        const sender = await userModel.findById(senderId).session(session)
        if(!sender){
            throw new Error("Sender not found!")
        }

        if(sender.balance < amount){
            throw new Error("Insufficient amount!");
        }

        //receiver ko dhundo
        const receiver = await userModel.findById(receiverId).session(session);
        if(!receiver){
            throw new Error("Receiver not found")
        }

        // 6. Maths calculation: Sender se kaato, Receiver ko do
        sender.balance -= amount;
        receiver.balance += Number(amount);

        // 7. Dono ko save karo (Rough copy mein
        await sender.save({session});
        await receiver.save({session});

        // 8. Transaction ki entry create karo history ke liye
        // await transactionModel.create(
        //     [{senderId :senderId, receiverId :receiverId, amount:amount, status:"success"}],
        //     {session}
        // )

        const newTransaction = new transactionModel({
            senderId: senderId,
            receiverId: receiverId,
            amount: amount,
            status: "success"
        });

        await newTransaction.save({ session });

        // 9. SAB KUCH THEEK HAI! Ab finally fair copy (Database) mein save kar do.
        (await session).commitTransaction();

        await sendDebitEmail(sender.email, sender.firstName, amount, sender.balance - amount).catch(console.log);
        await sendCreditEmail(receiver.email, receiver.firstName, amount, receiver.balance + amount).catch(console.log);

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

export const getMyTransactionSummary = async (req, res) => {
    try {
        // Yeh middleware se aayegi
        // NOTE: Aggregation me ObjectId direct string se match nahi hoti, isko convert karna padta hai
        const userId = new mongoose.Types.ObjectId(req.user.id); 

        const summary = await transactionModel.aggregate([
            // Stage 1: $match (Yeh SQL ke 'WHERE' ki tarah hai) - Sirf wahi transaction lao jisme logged-in user sender ho
            { 
                $match: { senderId: userId, status: "success" } 
            },
            // Stage 2: $group (Yeh SQL ke 'GROUP BY' ki tarah hai) - Saare amounts ko jod do
            {
                $group: {
                    _id: null, // null ka matlab hai ki saare matched documents ko ek hi group me daal do
                    totalAmountSent: { $sum: "$amount" }, // $sum SQL jaisa hi hai, "$amount" field ko add karega
                    totalTransactions: { $sum: 1 } // Har entry par 1 add karega (Count nikalne ke liye)
                }
            }
        ]);

        // Agar user ne koi transaction nahi ki hai, toh array khali aayega
        if (summary.length === 0) {
            return res.status(200).json({ totalAmountSent: 0, totalTransactions: 0 });
        }

        res.status(200).json({
            message: "Summary fetched successfully",
            data: summary[0] // Aggregation hamesha array deta hai, result 0th index par hoga
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Error fetching summary: ${error.message}` });
    }
};

export const requestMoney = async(req,res)=>{
    try {
        const requesterId = req.user.id;
        const { payerId, amount } = req.body;
        console.log(payerId)
        console.log(amount)
        if (!payerId || !amount) {
            return res.status(400).json({ message: "payerId ya amount are missing!" });
        }

        const newRequest = new transactionModel({
            receiverId: requesterId,
            senderId: payerId,
            amount: amount,
            type: "request",
            status: "pending"
        });

        await newRequest.save();

        const payerInfo = await userModel.findById(payerId);
        const requesterInfo = await userModel.findById(requesterId);

        sendMoneyRequestEmail(payerInfo.email, payerInfo.firstName, requesterInfo.firstName, amount);

        res.status(200).json({
            message: "Money request sent successfully!",
            requestId: newRequest._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
}

export const approvedRequest = async(req,res)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const payerId = String(req.user.id || req.user._id); // Logged-in user jo approve kar raha hai
        const requestId = req.params.id; // URL se request ki ID aayegi

        // 1. Find request and check conditions
        const request = await transactionModel.findById(requestId).session(session);
        
        if (!request) throw new Error("Request not found!");
        if (request.status !== "pending") throw new Error("This request is already processed!");
        if (String(request.senderId) !== payerId) {
            throw new Error("You are not authorized to approve this!");
        }

        // 2. Check Payer's Balance
        const payer = await userModel.findById(payerId).session(session);
        if (payer.balance < request.amount) throw new Error("Insufficient Balance to approve this request!");

        const requester = await userModel.findById(request.receiverId).session(session);
        
        const transferAmount = Number(request.amount);
        // 3. Deduct & Add Balance ($inc ka use kiya safety ke liye)
        await userModel.findByIdAndUpdate(payerId, { $inc: { balance: -transferAmount } }, { session });
        await userModel.findByIdAndUpdate(request.receiverId, { $inc: { balance: +transferAmount } }, { session });

        // 4. Update Request Status
        request.status = "success";
        await request.save({ session });

        // 5. Commit Transaction
        await session.commitTransaction();

        // 6. Send Email to Requester
        try {
            await sendApprovedEmail(requester.email, requester.firstName, payer.firstName, transferAmount);
        } catch (emailError) {
            console.log("Transaction successful, but Email failed to send:", emailError.message);
        }

        res.status(200).json({ message: "Request approved and money transferred!" });

    } catch (error) {
        console.log(error)
        return res.status(400).json({ message: error.message });
    } finally {
        session.endSession();
    }
}

export const rejectedRequest = async(req,res)=>{
    try {
        const payerId = String(req.user.id || req.user._id);
        const requestId = req.params.id;

        // Isme balance deduct nahi karna, sirf status change karna hai
        const request = await transactionModel.findOneAndUpdate(
            { _id: requestId, senderId: payerId, status: "pending" },
            { status: "rejected" },
            { new: true }
        );
        console.log(request)
        if (!request) {
            return res.status(404).json({ message: "Pending request not found or unauthorized!" });
        }

        const payer = await userModel.findById(payerId);
        const requester = await userModel.findById(request.receiverId);

        // Email bhejo ki request reject ho gayi
        try {
            sendRejectionEmail(requester.email, requester.firstName, payer.firstName, request.amount);
        } catch (emailError) {
            console.log("Requset rejected, but Email failed to send:", emailError.message);
        }
        res.status(200).json({ message: "Money request rejected." });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Error: ${error.message}` });
    }
}