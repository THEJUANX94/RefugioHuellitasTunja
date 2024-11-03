const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use(require('./Routes/authRoutes'))
app.use(require('./Routes/userRoutes'))


app.listen(4000, () => {console.log("Server started on port 5000")})