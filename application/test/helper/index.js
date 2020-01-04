let db = null;
let UserModel = null;

try {
    db = require('../../server/lib/db');
} catch (err) {
    console.log('Not implemented - db ignored');
}

try {
    UserModel = require('../../server/models/UserModel');
} catch (err) {
    console.log('Not implemented - UserModel ignored');
}

const config = require('../../server/config').test;

module.exports.UserModel = UserModel;
module.exports.config = config;

module.exports.validUser = {
    username: 'TestUser',
    email: 'test@acme.org',
    password: 'verysecret'
};

module.exports.before = async () => {
    if (db) {
        await db.connect(config.database.dsn);
    }
    if (UserModel) {
        return UserModel.deleteMany({});
    }
    return true;
};

module.exports.after = async () => {
    if (UserModel) {
        await UserModel.deleteMany({});
    }
};

// Local helper function that creates a user
module.exports.createUser = async (agent, user) => agent
    .post('/users/registration')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send(user);

// Local helper function that logs a user in
module.exports.loginUser = async (agent, email, password) => agent
    .post('/users/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({ email, password });
