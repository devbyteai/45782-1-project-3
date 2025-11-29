import { Sequelize } from 'sequelize-typescript';
import config from 'config';
import User from '../models/User';
import Vacation from '../models/Vacation';
import Like from '../models/Like';

const sequelize = new Sequelize({
    host: config.get('db.host'),
    port: config.get('db.port'),
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    dialect: 'mysql',
    models: [User, Vacation, Like],
    logging: false
});

export default sequelize;
