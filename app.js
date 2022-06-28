const express = require('express');

// Dependencies imports
require('dotenv').config();

const app = express()

//routes
const basePathV1 = '/api/v1';
const authPathV1 = `${basePathV1}/auth`;
const usersPathV1 = `${basePathV1}/users`;
app.use('/api/test', require('./routes/test-conn.routes'));
app.use(authPathV1, require('./routes/auth.routes'));
app.use(usersPathV1, require('./routes/users.routes'));

app.listen(process.env.PORT || 3000)