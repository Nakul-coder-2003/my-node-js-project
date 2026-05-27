import express from "express"
import {isAuthenticated} from "../middleware/auth.middleware.js"
import { transferMoney } from "../controllers/wallet.controller.js";

const walletRouter = express.Router();

walletRouter.post("/transfer", isAuthenticated, transferMoney)

export default walletRouter;