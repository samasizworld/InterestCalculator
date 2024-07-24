"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDbContext = exports.sequelizeConnect = void 0;
const sequelize_1 = require("sequelize");
let sequelize;
const sequelizeConnect = () => {
    sequelize = new sequelize_1.Sequelize(process.env.POSTGRES_DB, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
        dialect: "postgres",
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        pool: {
            max: 25,
            min: 0,
            idle: 3000,
            acquire: 100000,
        },
        logging: process.env.DB_LOGGING == 'true' ? true : false,
    });
};
exports.sequelizeConnect = sequelizeConnect;
const createDbContext = () => {
    return sequelize;
};
exports.createDbContext = createDbContext;
//# sourceMappingURL=DBConnection.js.map