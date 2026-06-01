import express from "express"
import {isAuthenticated} from "../middleware/auth.middleware.js"
import { approvedRequest, getMyTransactionSummary, rejectedRequest, requestMoney, transferMoney } from "../controllers/wallet.controller.js";

const walletRouter = express.Router();

walletRouter.post("/transfer", isAuthenticated, transferMoney)
walletRouter.get("/summary", isAuthenticated, getMyTransactionSummary)
walletRouter.post("/request", isAuthenticated, requestMoney);
walletRouter.post("/request/approve/:id", isAuthenticated, approvedRequest);
walletRouter.post("/request/reject/:id", isAuthenticated, rejectedRequest);

export default walletRouter;