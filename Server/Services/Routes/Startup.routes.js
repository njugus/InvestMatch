import { Router } from 'express'
import { CreateNewStartup } from '../Controllers/Startup.controllers.js'
import { GetAllStartups } from '../Controllers/Startup.controllers.js'
import authMiddleware from '../../Auth/authmiddleware.js'
const route_3 = Router()

route_3.post("/", authMiddleware, CreateNewStartup)
route_3.get("/",authMiddleware, GetAllStartups)