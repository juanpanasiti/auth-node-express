const mongoose = require('mongoose');
const Logger = require('../helpers/logger');

const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CNN);
        Logger.success('DB connected OK');
    } catch (error) {
        Logger.error(error);
        throw new Error('Error starting DB connection');
    }
};

module.exports = {
    dbConnection,
};
