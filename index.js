const express = require('express')
const morgan = require('morgan')
const app = express()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

app.use(cookieParser())
app.use(bodyParser.json())

app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Success.'
    })
})

app.get('/login', (req, res, next) => {
    const token = jwt.sign({
        user_id: '123',
        fullName: 'Walter White',
        role: [ 'GET_TODO' ],
        aud: 'auth-service',
        iss: 'http://localhost:8080'
    }, 'tokenSecret', {
        expiresIn: '1m'
    })

    // check if client sent cookie
    // const cookie = req.cookies.token;

    res.cookie('token', token, {
        maxAge: 1000 * 60 * 5,
        httpOnly: true
    })

    res.status(200).json({
        message: 'Successfully logged in.'
    })
})

app.get('/verify/token', (req, res, next) => {
    try {
        const { token } = req.cookies

        jwt.verify(token, 'tokenSecret', {
            algorithms: [ 'HS256' ],
            audience: 'auth-service',
            issuer: 'http://localhost:8080'
        }, (error, decoded) => {
            if (error) {
                throw new Error(error.message)
            }
            req.decoded = decoded
        })
    
        res.status(200).json({
            message: req.decoded
        })
    } catch (err) {
        res.status(400).json({
            error: err.message
        })
    }
})

const server = app.listen('8080', () => {
    // Need to disable rule to display that Express.js is running already
    // eslint-disable-next-line no-console
    console.log(`Express is running on port ${server.address().port}.`)
})