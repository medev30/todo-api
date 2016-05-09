var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var todos = [{
    id: 1,
    description: 'Meet mom for lunch',
    completed: false
}, {
    id: 2,
    description: 'Go to market',
    completed: false
}, {
    id: 3,
    description: 'Watch Postman',
    completed: true
}];

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

app.listen(PORT, function() {
    console.log('Server running on port ' + PORT);
});
