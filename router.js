import express from 'express'
import {login, logout, sendQuestion, setBlocks, adminToken, admin_page_params} from './admin.js'
import {getQuestions, sendFormAnswer} from './form.js'
import {getResults} from './result.js'
import bodyParser from 'body-parser'

export const router = express.Router()

const jsonParser = bodyParser.json()

router.get('/', getQuestions)
router.get('/result', getResults)
router.get('/admin', (req, res) => {
    const isAdmin = req.cookies.token !== undefined ? adminToken === req.cookies.token : false
    admin_page_params.is_admin = isAdmin

    if (isAdmin)
        setBlocks(req, res)
    else
        res.render('admin', admin_page_params)
})

const urlencodedParser = express.urlencoded({extended: false});
router.post('/admin-login', urlencodedParser, login)
router.post('/admin-logout', logout)
router.post('/admin-add-question', urlencodedParser, sendQuestion)
router.post('/send-form', urlencodedParser, sendFormAnswer)


