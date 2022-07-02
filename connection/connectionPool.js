const mySql = require('mysql')
const pool = mySql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: process.env.SQLPORT
})

module.exports = pool