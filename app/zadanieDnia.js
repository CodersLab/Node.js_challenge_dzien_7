const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('./public/zadanieDnia/'));

const DB_FILE = './data/zadanieDnia/db.json';

app.get('/show', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      const todos = JSON.parse(data);
      res.json({
        todos
      });
    } else {
      console.log('Błąd odczytu pliku', err);
    }
  });
});

app.post('/add', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      const todos = JSON.parse(data);
      todos.push({
        todo: req.body.todo,
        complete: req.body.complete
      });
      const updateTodos = JSON.stringify(todos);

      fs.writeFile(DB_FILE, updateTodos, (err, data) => {
        if (!err) {
          res.json({
            todos
          });
          console.log('Added Todo:', req.body.todo);
        } else {
          console.log('Błąd zapisu pliku', err);
        }
      });
    } else {
      console.log('Błąd odczytu pliku', err);
    }
  });
});

app.post('/toggle', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      const todos = JSON.parse(data);
      todos[req.body.i].complete = !todos[req.body.i].complete;
      const updateTodos = JSON.stringify(todos);

      fs.writeFile(DB_FILE, updateTodos, (err, data) => {
        if (!err) {
          res.json({
            todos
          });
          console.log('Toggle Todo nr :', req.body.i);
        } else {
          console.log('Błąd zapisu pliku', err);
        }
      });
    } else {
      console.log('Błąd odczytu pliku', err);
    }
  });
});

app.post('/destroy', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      const todos = JSON.parse(data);
      todos.splice(req.body.i, 1);
      const updateTodos = JSON.stringify(todos);

      fs.writeFile(DB_FILE, updateTodos, (err, data) => {
        if (!err) {
          res.json({
            todos
          });
          console.log('Removed Todo nr :', req.body.i);
        } else {
          console.log('Błąd zapisu pliku', err);
        }
      });
    } else {
      console.log('Błąd odczytu pliku', err);
    }
  });
});

app.listen(3000, () => {
  console.log('Serwer uruchomiony na porcie 3000');
});