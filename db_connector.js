import {Sequelize} from "sequelize";

export const sequelizer = new Sequelize(
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