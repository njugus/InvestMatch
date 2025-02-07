import authMiddleware from "../../Auth/authmiddleware.js";
import { Router } from 'express'
import investorProfile from "../Controllers/Investor.controllers.js";

const route_1 = Router()

route_1.post("/", authMiddleware, investorProfile)

