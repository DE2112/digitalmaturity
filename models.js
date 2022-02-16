import sequelize from "sequelize";
import {sequelizer} from "./db_connector.js";

export class admins extends sequelize.Model {}
export class blocks extends sequelize.Model {}
export class questions extends sequelize.Model {}
export class answers extends sequelize.Model {}

export class departments extends sequelize.Model {}
export class formAnswers extends sequelize.Model {}

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
    }
}, {sequelize: sequelizer, modelName: 'questions', createdAt: false, updatedAt: false})
questions.belongsTo(blocks, {foreignKey: 'block_id'})

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
    }
}, {sequelize: sequelizer, modelName: 'answers', createdAt: false, updatedAt: false})
answers.belongsTo(questions, {foreignKey: 'question_id'})

departments.init({
    department_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    department_name: {
        type: sequelize.STRING,
        allowNull: false
    }
}, {sequelize: sequelizer, modelName: 'departments', createdAt: false, updatedAt: false})

formAnswers.init({
    person_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: sequelize.STRING(100),
        allowNull: false
    },
    results: {
        type: sequelize.ARRAY(sequelize.INTEGER),
        allowNull: false
    }
}, {sequelize: sequelizer, modelName: 'form_answers', createdAt: false, updatedAt: false})
formAnswers.belongsTo(departments, {foreignKey: 'department_id'})