import express from 'express'
import route_1 from './Routes/users.routes.js';
const app = express()
const PORT = 5000;

app.use("/api/v1", route_1)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
