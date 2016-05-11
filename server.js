var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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

app.get('/todos', function (req, res) {
    res.json(todos);
});

// GET /todos/:id

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    var matchedTodo = _.findWhere(todos, {id: todoId});

    // var matchedTodo;
    // todos.forEach(function(item) {
    //     if (todoId === item.id) {
    //         matchedTodo = item;
    //     }
    // });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
});

// app.get('/todos/:id', function (req, res) {
//     var todoId = parseInt(req.params.id, 10);
//     var matchedTodo;
//
//     todos.forEach(function(item) {
//         if (todoId === item.id) {
//             matchedTodo = item;
//         }
//     });
//
//     if (matchedTodo) {
//         res.json(matchedTodo);
//     } else {
//         res.status(404).send();
//     }
// });

// POST /todos
app.post('/todos', function (req, res) {
    // use _.pick to only pick desired keys
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
        return res.status(400).send();
    }

    body.description = body.description.trim();

    body.id = todoNextId++;
    // todoNextId += 1;

    todos.push(body);

    // console.log('description: ' + body.description);

    res.json(body);
});

// DELETE /todos/:id

app.delete('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);

    var matchedTodo = _.findWhere(todos, {id: todoId});


    if (!matchedTodo) {
        res.status(404).json({"error": "no todo found with that id"});
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }
});



app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
