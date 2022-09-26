const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Success.'
    })
})

const server = app.listen('8080', () => {
    // Need to disable rule to display that Express.js is running already
    // eslint-disable-next-line no-console
    console.log(`Express is running on port ${server.address().port}.`)
})