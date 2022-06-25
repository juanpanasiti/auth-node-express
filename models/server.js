const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');
const Logger = require('../helpers/logger');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        const basePathV1 = '/api/v1';
        this.authPathV1 = `${basePathV1}/auth`;
        this.usersPathV1 = `${basePathV1}/users`;

        // DB Connection
        this.connectDadaBase();

        // Middlewares
        this.middlewares();

        // Body read and parse
        this.app.use(express.json());

        // Routes
        this.setRoutes();
    }

    async connectDadaBase() {
        await dbConnection()
    }

    middlewares() {
        this.app.use(cors());
        if (process.env.ENVIRONMENT === 'dev') {
            // Just log calls to API in dev environment
            const morgan = require('morgan');
            this.app.use(morgan('tiny'));
        }
        // ? Add static 'public'?
    }

    setRoutes() {
        this.app.use('/api/test', require('../routes/test-conn.routes'));
        this.app.use(this.authPathV1, require('../routes/auth.routes'));
        this.app.use(this.usersPathV1, require('../routes/users.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            Logger.success('Server running on port', this.port)
        });
    }
}

module.exports = Server;
