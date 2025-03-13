import express from 'express'
import route_1 from './Routes/users.routes.js';
import cookieParser from 'cookie-parser';
import route_2 from './Routes/roles.routes.js';
import loginRoute from './Routes/login.routes.js';
import route_investors from './Services/Routes/Investors.Routes.js';
import investment_route from './Services/Routes/InvestmentRoutes.js'
import route_3 from './Services/Routes/Startup.routes.js'
import route_5 from './Services/Routes/Recommendations.routes.js'
import updateInvestorEmbeddings from './Services/Embeddings/InvestorEmbeddings.js';
import updateStartupEmbeddings from './Services/Embeddings/StartupEmbeddings.js'
import cors from 'cors'

const app = express()
const PORT = 5000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, 
    optionsSuccessStatus: 204
}))


app.use("/signUp/api/v1", route_1)
app.use("/addRole/api/v1", route_2)
app.use("/login/api/v1", loginRoute)
app.use("/getAllUsers/api/v1", route_1)
app.use("/investor/api/v1",  route_investors)
app.use("/getInvestor/api/v1", route_investors)
app.use("/getInvestorByID/api/v1", route_investors)
app.use("/investor/v1", route_investors)
app.use("/getInvestorRecommendations/v1", route_5)
app.use("/investor/v1/getInvestments", investment_route)
app.use("/investor/v1", investment_route)
app.use("/startup/v1", route_3)



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
