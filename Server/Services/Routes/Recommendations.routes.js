import authMiddleware from '../../Auth/authmiddleware.js'
import { Router } from 'express'
import { findTopStartupsForInvestors } from '../../Services/Controllers/Recommendations.controllers.js'
import { matchFilteredStartups } from '../../Services/Controllers/Recommendations.controllers.js'

const route_5 = Router()
route_5.get("/top-startups", authMiddleware, findTopStartupsForInvestors)
route_5.get("/filtered-startups", authMiddleware, matchFilteredStartups)

export default route_5