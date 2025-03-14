import { Router } from 'express'
import { CreateNewStartup } from '../Controllers/Startup.controllers.js'
import { GetAllStartups } from '../Controllers/Startup.controllers.js'
import { GetSpecificStartup } from '../Controllers/Startup.controllers.js'
import { UpdateStartupFounders } from '../Controllers/Startup.controllers.js'
import { UpdateFinancialMetrics } from '../Controllers/Startup.controllers.js'
import { UpdateTractionMetrics } from '../Controllers/Startup.controllers.js'
import authMiddleware from '../../Auth/authmiddleware.js'
import { updateStartupEmbeddings } from '../Controllers/Startup.controllers.js'
const route_3 = Router()

route_3.post("/", authMiddleware, CreateNewStartup)
route_3.get("/",authMiddleware, GetAllStartups)
route_3.get("/:id", authMiddleware, GetSpecificStartup)
route_3.patch("/:id/founders", authMiddleware, UpdateStartupFounders)
route_3.patch("/:id/financial-metrics", authMiddleware, UpdateFinancialMetrics)
route_3.patch("/:id/traction-metrics", authMiddleware, UpdateTractionMetrics)
route_3.put("/update-startup-embeddings", authMiddleware, updateStartupEmbeddings);

export default route_3;
