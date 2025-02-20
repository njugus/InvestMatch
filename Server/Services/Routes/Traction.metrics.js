import { Router } from 'express'
import authMiddleware from '../../Auth/authmiddleware.js'
import { UpdateTractionMetrics } from '../Controllers/Startup.controllers.js'
const route_5 = Router()

route_5.patch("/:id", authMiddleware, UpdateTractionMetrics)

