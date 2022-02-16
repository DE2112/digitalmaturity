import crypto from 'crypto'
import {blocks, questions, answers, admins} from './models.js'

export let adminToken = undefined

export let admin_page_params = {
    title: 'Панель Администратора',
    active: 'admin',
    is_admin: false,
    blocks: await blocks.findAll({raw:true})
}

export async function login(req, res) {
    if (!req.body) return res.sendStatus(400)

    console.log(req.body)
    let login = req.body['admin-login']
    let password = req.body['admin-password']
    password = crypto.createHash('sha256').update(password).digest('hex')
    console.log(password)

    const results = await admins.findOne({
        where: {
            login: login
        }
    })

    if (results.password === password && req.cookies.token !== undefined) {
        adminToken = req.cookies.token

        admin_page_params.is_admin = true
    }

    res.render('admin', admin_page_params)
}

export async function logout(req, res) {
    adminToken = undefined
    admin_page_params.is_admin = false

    res.render('admin', admin_page_params)
}

export async function sendQuestion(req, res) {
    if (!req.body) return res.sendStatus(400)

    let blockId = req.body['block-id']
    console.log(blockId)
    let questionText = req.body['question-text']
    console.log(questionText)
    await questions.create({text: questionText, block_id: blockId})
        .catch((err) => {console.log(err)})

    let question = await questions.findOne({
        where: {
            text: questionText
        }
    })

    let answerText = req.body['answers'].split('###', 4)

    for (let i = 0; i < 4; i++) {
        console.log(answerText)
        console.log(question['question_id'])
        await answers.create({ text: answerText[i], value: i, question_id: question['question_id']})
            .catch((err) => {console.log(err)})
    }

    res.render('admin', admin_page_params)
}

export async function setBlocks(req, res) {
    res.render('admin', admin_page_params)
}


