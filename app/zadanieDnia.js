const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID

var db
MongoClient.connect('mongodb://cruder:crud123@ds123658.mlab.com:23658/crud', (err, database) => {
  if (err) return console.log(err)
  db = database
  app.listen(process.env.PORT || 3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static('./public/zadanieDnia/'))
/*
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(express.static('./public/zadanieDnia/'));

const DB_FILE = './data/zadanieDnia/db.json';
*/

app.get('/', (req, res) => {
  db.collection('todo').find().toArray((err, result) => {
    if (err) return console.log(err)
    console.log(result)
    res.render('index.ejs', {
      todos: result
    })
  })
})
/*
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
*/

app.post('/add', (req, res) => {
  db.collection('todo').insertOne({
    todo: req.body.todo,
    complete: false
  }, (err, result) => {
    if (err) return console.log(err)
    console.log('Added Todo')
    res.redirect('/')
  })
})
/*
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
*/

app.put('/toggle/:id/:checked', (req, res) => {
  let checked = Boolean(JSON.parse(req.params.checked))
  console.log(checked);
  db.collection('todo').update({
    _id: ObjectId(req.params.id)
  }, {
    $set: {
      complete: checked
    }
  }, (err, result) => {
    if (err) return res.status(500).send(err)
    console.log('Toggle id:', req.params.id, req.params.checked)
    res.redirect(303, '/')
  })
})
/*
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
*/

app.put('/edit/:update_json', (req, res) => {
  const update = JSON.parse(req.params.update_json)
  update.forEach((item) => {
    db.collection('todo').update({
      _id: ObjectId(item.id)
    }, {
      $set: {
        todo: item.todo
      }
    })
    console.log('Updated id:', item.id, ' value: ', item.todo)
  })
  res.redirect(303, '/')
})
/*
app.post('/edit', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      const todos = JSON.parse(data);
      req.body.i.forEach((val, index) => {
        todos[val].todo = req.body.editTodo[index];
      });
      const updateTodos = JSON.stringify(todos);

      fs.writeFile(DB_FILE, updateTodos, (err, data) => {
        if (!err) {
          res.json({
            todos
          });
          console.log('Edited Todos id:', req.body.i, "value: ", req.body.editTodo);
        } else {
          console.log('Błąd zapisu pliku', err);
        }
      });
    } else {
      console.log('Błąd odczytu pliku', err);
    }
  });
});
*/

app.delete('/todo/:id', (req, res) => {
  db.collection('todo').deleteOne({
    _id: ObjectId(req.params.id)
  }, (err, result) => {
    if (err) return res.status(500).send(err)
    console.log('Deleted id:', req.params.id)
    res.redirect(303, '/')
  })
})
/*
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
*/

app.delete('/clear', (req, res) => {
  db.collection('todo').deleteMany({
    complete: true
  }, (err, result) => {
    if (err) return res.status(500).send(err)
    console.log('Clear completed')
    res.redirect(303, '/')
  })
})
/*
app.post('/clear', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      let todos = JSON.parse(data);
      todos = todos.filter(item => !item.complete);
      const updateTodos = JSON.stringify(todos);

      fs.writeFile(DB_FILE, updateTodos, (err, data) => {
        if (!err) {
          res.json({
            todos
          });
          console.log('Cleared completed');
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
*/
