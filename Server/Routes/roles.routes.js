import { Router } from 'express'
import { userRole } from '../Controllers/users.controllers.js'

const route_2 = Router()

route_2.post("/", userRole)

export default route_2;
