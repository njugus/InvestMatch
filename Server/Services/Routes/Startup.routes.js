import { Router } from 'express'
import { CreateNewStartup } from '../Controllers/Startup.controllers'
import authMiddleware from '../../Auth/authmiddleware'
const route_3 = Router()

route_3.post("/", authMiddleware, CreateNewStartup)