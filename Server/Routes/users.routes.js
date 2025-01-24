import { Router } from 'express'
import { signUp } from '../Controllers/users.controllers.js'

const route_1 = Router()

route_1.post("/", signUp)

export default route_1;

