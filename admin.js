import express from 'express'
import path from 'path'
import sequelize from 'sequelize'
import crypto from 'crypto'
import sanitizer from 'sanitize'
import {Sequelize} from "sequelize";
import cookies from 'cookies'

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


admins.init({
    admin_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },

}, {sequelize: sequelizer, modelName: 'admins', createdAt: false, updatedAt: false})

export let adminToken = undefined

export async function getInput(req, res) {
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
        res.render('admin', {title: 'Панель Администратора', active: 'admin', is_admin: true})
    }
}


