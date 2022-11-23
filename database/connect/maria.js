const maria = require('mysql');

const conn = maria.createConnection({
    host: 'localhost',
    port: 3306,
    user:'ark',
    password:'K795d0751h!',
    database:'stockdata'
})

module.exports = conn;