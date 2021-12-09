import express from 'express'
import {getLoginInput, adminToken, admin_page_params} from './admin.js'
import cookies from 'cookies'

export const router = express.Router()

router.get('/', (req, res) => {
    res.render('form', { title: 'Форма', active: 'form' })
})

router.get('/admin', (req, res) => {
    const isAdmin = req.cookies.token !== undefined ? adminToken === req.cookies.token : false
    admin_page_params.is_admin = isAdmin
    res.render('admin', {admin_page_params})
})

const urlencodedParser = express.urlencoded({extended: false});
router.post('/admin', urlencodedParser, getLoginInput)

router.get('/result', (req, res) => {
    res.render('result', { title: 'Результат', active: 'result' })
})


