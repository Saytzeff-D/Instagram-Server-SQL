const mySql = require('mysql')
const pool = mySql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'instagram_db'
})

module.exports = pool