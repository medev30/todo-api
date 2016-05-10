var express = require('express');
var bodyParser = require('body-parser');

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

app.get('/todos/:id', function (req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo;

    todos.forEach(function(item) {
        if (todoId === item.id) {
            matchedTodo = item;
        }
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }

    // console.log('Finished');
    // res.send('Todo # ' + todoId + ' not found');
});

// POST /todos
app.post('/todos', function (req, res) {
    var body = req.body;

    body.id = todoNextId++;
    // todoNextId += 1;

    todos.push(body);

    // console.log('description: ' + body.description);

    res.json(body);
});

app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
