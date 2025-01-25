import { Router } from "express";
import { Login } from "../Controllers/login.controllers.js";

const loginRoute = Router()

loginRoute.post("/", Login)

export default loginRoute