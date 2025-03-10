import authMiddleware from '../../Auth/authmiddleware.js'
import { Router } from 'express'
import { findTopStartupsForInvestors } from '../../Services/Controllers/Recommendations.controllers.js'

const route_5 = Router()
route_5.get("/top-startups", authMiddleware, findTopStartupsForInvestors)

export default route_5