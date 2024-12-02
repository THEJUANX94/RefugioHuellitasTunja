const express = require('express')
const cors = require('cors');
const app = express()
const cookieParser = require('cookie-parser')

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser())

app.use(require('./Routes/auth.Routes.js'))
app.use(require('./Routes/userRoutes.js'))
app.use(require('./Routes/pet.Routes.js'))
app.use(require('./Routes/Form.Routes'))
app.use(require('./Routes/bill.Routes.js'))
app.use(require('./Routes/billDetail.Routes.js'))
app.use(require('./Routes/lot.Routes.js'))
app.use(require('./Routes/products_lot.Routes.js'))
app.use(require('./Routes/products.Routes.js'))
app.use(require('./Routes/products.Routes.js'))
app.use(require('./Routes/adoptions.Routes.js'))
app.use(require('./Routes/donation.Routes.js'))


app.listen(4000, () => {console.log("Server started on port 4000")})