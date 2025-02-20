import { Router} from 'express'
import authMiddleware from '../../Auth/authmiddleware.js'
import { UpdateFinancialMetrics } from '../Controllers/Startup.controllers.js'
const route_4 = Router()

route_4.patch(":/id", authMiddleware, UpdateFinancialMetrics)
