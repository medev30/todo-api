var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

// var todos = [{
//     id: 1,
//     description: 'Meet dad for lunch',
//     completed: false
// }, {
//     id: 2,
//     description: 'Go to market',
//     completed: false
// }, {
//     id: 3,
//     description: 'Watch Postman',
//     completed: true
// }];

app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('Todo API Root');
});

// GET /todos?completed=true&q=walk
app.get('/todos', function (req, res) {
    var query = req.query;
    var where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {

        // make Postgre on Heroku to use $iLike -> case insensitive search
        var key = (db.env === 'production') ? '$iLike' : '$like';
        where.description = {};
        where.description[key] = '%' + query.q + '%';
    }

    db.todo.findAll({ where: where }).then(function (todo) {
        res.json(todo);
    }, function (e) {
        res.status(500).send();
    });
});

// GET /todos/:id

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.findById(todoId).then(function (todo) {
       if (!!todo) {
           res.json(todo);
       } else {
           res.status(404).send('No todo found!');
       }
    }, function(e) {
       res.status(500).send(e);
    });

    // var matchedTodo = _.findWhere(todos, {id: todoId});
    //
    // if (matchedTodo) {
    //     res.json(matchedTodo);
    // } else {
    //     res.status(404).send();
    // }
});


// POST /todos
app.post('/todos', function (req, res) {
    // use _.pick to only pick desired keys
    var body = _.pick(req.body, 'description', 'completed');

    db.todo.create(body).then(function (todo) {
        res.json(todo);
    }).catch(function (e) {
        console.log(e);
        res.status(400).json(e);
    });
});

// DELETE /todos/:id
app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    db.todo.destroy({
        where: {
            id: todoId
        }
    }).then(function (rowsDeleted) {
        if (rowsDeleted === 0) {
            res.status(404).json({
                error: 'No todo with id'
            });
        } else {
            res.status(204).send();
        }
    }, function () {
        res.status(500).send();
    });
});


// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {id: todoId});
    var body = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (!matchedTodo) {
        return res.status(404).send();
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed))  {
        validAttributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed')) {
        return res.status(400).send();
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0)  {
        validAttributes.description = body.description;
    } else if (body.hasOwnProperty('description')) {
        return res.status(400).send();
    }

    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);

});

db.sequelize.sync().then(function () {
    app.listen(PORT, function() {
        console.log('Server running on port ' + PORT);
    });
});
