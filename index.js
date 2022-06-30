const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json({limit: '50mb'}))
const cors = require('cors')
app.use(cors())
const router = require('./routes/route')
app.use('/', router)

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Instagram Server is listening on port ${port}. Open your Browser to http://localhost:7000 to view.`))