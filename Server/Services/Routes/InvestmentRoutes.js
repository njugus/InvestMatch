import { Router} from 'express'
import authMiddleware from '../../Auth/authmiddleware.js'
import { getUserInvestment } from '../Controllers/Investor.controllers'

const route_2 = Router()

route_2.get("/:id", authMiddleware, getUserInvestment)