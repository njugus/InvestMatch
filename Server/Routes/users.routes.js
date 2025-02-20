import { Router } from 'express'
import { signUp } from '../Controllers/users.controllers.js'
import { FindAllRegisteredUsers } from '../Controllers/users.controllers.js'

const route_1 = Router()

route_1.post("/", signUp)
route_1.get("/", FindAllRegisteredUsers)

export default route_1;

