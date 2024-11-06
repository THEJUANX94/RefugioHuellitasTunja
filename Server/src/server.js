const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser())

app.use(require('./Routes/authRoutes.js'))
app.use(require('./Routes/userRoutes.js'))
app.use(require('./Routes/petRoutes.js'))


app.listen(4000, () => {console.log("Server started on port 4000")})