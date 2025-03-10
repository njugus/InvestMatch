import authMiddleware from "../../Auth/authmiddleware.js";
import { Router } from 'express'
import { investorProfile } from "../Controllers/Investor.controllers.js";
import { getAllInvestors } from "../Controllers/Investor.controllers.js";
import { getInvestorByID } from "../Controllers/Investor.controllers.js";
import { getProfileData } from "../Controllers/Investor.controllers.js";
import { updateInvestorEmbeddings } from '../Controllers/Investor.controllers.js';


const route_investors = Router()

route_investors.post("/", authMiddleware, investorProfile)
route_investors.get("/", authMiddleware, getAllInvestors)
route_investors.get("/:id", authMiddleware, getInvestorByID)
route_investors.get("/getProfileData/:id", authMiddleware, getProfileData)
route_investors.put("/update-investor-embeddings", authMiddleware, updateInvestorEmbeddings);


export default route_investors;