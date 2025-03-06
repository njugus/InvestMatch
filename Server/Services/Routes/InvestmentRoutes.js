import { Router} from 'express'
import authMiddleware from '../../Auth/authmiddleware.js'
import { getUserInvestment } from '../Controllers/Investor.controllers.js'
import { updateUsersInvestments } from '../Controllers/Investor.controllers.js'

const investment_route = Router()

investment_route.get("/:id", authMiddleware, getUserInvestment)
investment_route.patch("/:id/investments", authMiddleware, updateUsersInvestments)

export default investment_route