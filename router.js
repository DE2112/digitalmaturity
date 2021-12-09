import express from 'express'
import {getInput, adminToken} from './admin.js'
import cookies from 'cookies'

export const router = express.Router()

router.get('/', (req, res) => {
    res.render('form', { title: 'Форма', active: 'form' })
})

router.get('/admin', (req, res) => {
    const isAdmin = req.cookies.token !== undefined ? adminToken === req.cookies.token : false
    res.render('admin', { title: 'Панель Администратора', active: 'admin' , is_admin: isAdmin})
    console.log(adminToken === req.cookies.token)
    console.log(adminToken)
    console.log(req.cookies.token)
})

const urlencodedParser = express.urlencoded({extended: false});
router.post('/admin', urlencodedParser, getInput)

router.get('/result', (req, res) => {
    res.render('result', { title: 'Результат', active: 'result' })
})


