var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;
console.log('ENV = ' + env);

if (env === 'production') {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        'dialect': 'postgres'
    });
} else {
    sequelize = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}

var db = {};
db.env = env;

db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.sequelize = sequelize;
// db.Sequelize = Sequelize;

// var a = Sequelize.hook;
//
// console.log(a.__CODE);
//
// console.log(Sequelize.hook);
// console.log(db.todo);
module.exports = db;
