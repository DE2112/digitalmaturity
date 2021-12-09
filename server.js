import express from 'express'
import path from 'path'
import {router} from "./router.js"
import crypto from "crypto"
import cookieParser from "cookie-parser"

const __dirname = path.resolve()
const PORT = 8000

const app = express()

app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'ejs'))

app.use(cookieParser())
app.use((req, res, next) => {
    const token = req.cookies.token
    if (token === undefined){
        res.cookie('token', generateToken(), {
            maxAge: 3600 * 24,
            httpOnly: true
        })
    }

    next()
})

app.use('/', router)

function generateToken() {
    let str = Math.random().toString(16).substr(2, 8);
    str = crypto.createHash('sha256').update(str).digest('hex')
    return str
}

app.listen(PORT)