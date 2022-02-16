import {questions, answers, formAnswers, departments} from './models.js'

export let form_page_params = {
    title: 'Форма',
    active: 'form',
    is_sent: false,
    departments: await departments.findAll({raw:true}),
    questions: await questions.findAll({raw:true}),
    answers: await answers.findAll({raw:true})
}

export let userToken = undefined

export async function getQuestions(req, res) {
    form_page_params.departments = await departments.findAll({raw:true})
    form_page_params.question = await questions.findAll({raw:true})
    form_page_params.answer = await answers.findAll({raw:true})

    const isSent = req.cookies.token !== undefined ? userToken === req.cookies.token : false
    form_page_params.is_sent = isSent

    res.render('form', form_page_params)
}

export async function sendFormAnswer(req, res) {
    if (!req.body) return res.sendStatus(400)
    userToken = req.cookies.token
    form_page_params.is_sent = true

    await formAnswers.create({name: req.body['name'], department_id: req.body['department-id'], results: getResult(req)})
        .catch((err) => {console.log(err)})
    console.log(req.body['name'] + ' - ' + req.body['department-id'] + ' - ' + getResult(req).toString())

    res.render('form', form_page_params)
}

function getResult(req) {
    let allResults = []
    for (let i = 0; i < form_page_params.questions.length; i++) {
        allResults[i] = parseInt(req.body[`${i}`])
    }

    let resultsByBlock = []
    for (let i = 0; i < 7; i++) {
        resultsByBlock[i] = 0
        for (let j = 3 * i; j < 3 * i + 3; j++) {
            resultsByBlock[i] += allResults[j]
        }
        console.log(resultsByBlock[i])
    }

    return resultsByBlock
}