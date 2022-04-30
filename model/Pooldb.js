const { Pool } = require("pg");
require('dotenv').config();

const config = {
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASS,
	port: process.env.DB_PORT,
    max: 20,
    min: 5,
    idleTimeoutMillis: 20000,
    connectionTimeoutMillis: 4000,
};

const Singleton = (() => {
    let instance;
    const createInstance = () => {
        var classObj = new Pool(config);
        return classObj;
    }

    return {
        getInstance: () => {
            if (!instance) {
                instance = createInstance();
                console.log("Pool created");
            }
            else {
                console.log("Pool already exists");
            }
            return instance;
        },
    };
})();

module.exports = Singleton;