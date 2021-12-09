import express from 'express'
import path from 'path'
import sequelize from 'sequelize'
import crypto from 'crypto'
import sanitizer from 'sanitize'
import {Sequelize} from "sequelize";
import cookies from 'cookies'

export let admin_page_params = {
    title: 'Панель Администратора',
    active: 'admin' ,
    is_admin: false,
    question_form_params: {
        blocks: {}
    }
}

const sequelizer = new Sequelize(
    'postgres',
    'de2112',
    '20012112',
    {
        dialect: 'postgres',
    }
)
sequelizer.authenticate()
    .then(() => console.log('Connected'))
    .catch((err) => console.error('Connection error: ', err))

class admins extends sequelize.Model {}
class blocks extends sequelize.Model {}
class questions extends sequelize.Model {}
class answers extends sequelize.Model {}

admins.init({
    admin_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    login: {
        type: sequelize.STRING(100),
        allowNull: false
    },
    password: {
        type: sequelize.TEXT,
        allowNull: false
    }
}, {sequelize: sequelizer, modelName: 'admins', createdAt: false, updatedAt: false})


blocks.init({
    block_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: sequelize.STRING(100),
        allowNull: false
    }
}, {sequelize: sequelizer, modelName: 'blocks', createdAt: false, updatedAt: false})

questions.init({
   question_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: sequelize.STRING(100),
        allowNull: false
    },
    block_id: {
       type: sequelize.INTEGER,
       references: 'blocks',
       referencesKey: 'block_id',
       allowNull: false
    }

}, {sequelize: sequelizer, modelName: 'questions', createdAt: false, updatedAt: false})
blocks.hasMany(questions)

answers.init({
    answer_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: sequelize.STRING(100),
        allowNull: false
    },
    value: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    question_id: {
        type: sequelize.INTEGER,
        references: 'questions',
        referencesKey: 'question_id',
        allowNull: false
    }
}, {sequelize: sequelizer, modelName: 'answers', createdAt: false, updatedAt: false})
questions.hasMany(answers)


export let adminToken = undefined

export async function getLoginInput(req, res) {
    if (!req.body) return res.sendStatus(400)
    //const login = sanitizer().value(req.body['admin-login'], 'string')
    const login = req.body['admin-login']
    let password = req.body['admin-password']
    //password = crypto.createHash('sha256').update(sanitizer().value(password, 'string')).digest('hex')
    password = crypto.createHash('sha256').update(password).digest('hex')
    console.log(password)

    const results = await admins.findOne({
        where: {
            login: login
        }
    })

    if (results['password'] === password && req.cookies.token !== undefined) {
        adminToken = req.cookies.token

        admin_page_params.is_admin = true
        res.render('admin', {admin_page_params})
    }
}

export async function renderBlockSelect(req, res) {
    if (!req.body) return res.sendStatus(400)

    admin_page_params.question_form_params.blocks = await blocks.findAll()
}


