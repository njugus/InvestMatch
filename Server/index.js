import express from 'express'
import route_1 from './Routes/users.routes.js';
import cookieParser from 'cookie-parser';
import route_2 from './Routes/roles.routes.js';
import loginRoute from './Routes/login.routes.js';

const app = express()
const PORT = 5000;

app.use(express.json());
app.use(cookieParser())

app.use("/signUp/api/v1", route_1)
app.use("/addRole/api/v1", route_2)
app.use("/login/api/v1", loginRoute)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
