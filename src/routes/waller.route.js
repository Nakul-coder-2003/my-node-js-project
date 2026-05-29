import express from "express"
import {isAuthenticated} from "../middleware/auth.middleware.js"
import { getMyTransactionSummary, transferMoney } from "../controllers/wallet.controller.js";

const walletRouter = express.Router();

walletRouter.post("/transfer", isAuthenticated, transferMoney)
walletRouter.get("/summary", isAuthenticated, getMyTransactionSummary)

export default walletRouter;