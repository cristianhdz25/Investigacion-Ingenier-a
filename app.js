const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { connect } = require('http2');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://localhost:27017/todos', { useNewUrlParser: true }, { useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('Connected to MongoDB');
});

connection.on('error', () => {
    console.log('Error connecting to MongoDB');
});

//modelo para operaciones CRUD
const Todo = mongoose.model('todo', {
    text: String,
    completed: Boolean
});

app.post('/add', (req, res) => {
    const todo = new Todo({ text: req.body.text, completed: false });
    todo.save().then(doc => {
        res.json({ response: 'Todo added successfully' });
    }).catch(err => {
        res.json({ response: 'Error adding todo' });
    });
});

app.get('/getall', (req, res) => {
    Todo.find({}, 'text completed').then(todos => {
        res.json(todos);
    }).catch(err => {
        res.json({ response: 'Error fetching todos' });
    });
});


app.get('/complete/:id/:status', (req, res) => {
    const id = req.params.id;
    const status = req.params.status === 'true'; //convertir a booleano

    Todo.findByIdAndUpdate({ _id: id }, { $set: { completed: status } }).then(doc => {
        res.json({ response: 'Todo updated successfully' });
    }).catch(err => {
        res.json({ response: 'Error updating todo' });
    });
});

app.post('/update', (req, res) => {
    Todo.update
        ({ _id: req.body.id }, { $set: { completed: req.body.completed } }).then(doc => {
            res.json({ response: 'Todo updated successfully' });
        }).catch(err => {
            res.json({ response: 'Error updating todo' });
        });
});

app.get('/delete/:id', (req, res) => {
    const id = req.params.id;

    Todo.findByIdAndDelete({ _id: id }).then(doc => {
        res.json({ response: 'Todo deleted successfully' });
    }).catch(err => {
        res.json({ response: 'Error updating todo' });
    });
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});




