//Twój kod
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const DB_FILE = './app/data/zadanieDnia/db.json';

const app = express();

app.use(bodyParser.json());
app.use(express.static('./app/public/zadanieDnia/'));

app.post('/list/all', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err){
      const newList = JSON.parse(data);
      const response = 'Baza danych odczytana';

      res.json({ newList, response });
    } else {
      const response = 'Błąd odczytu bazy danych';

      res.json({ response });
      console.log(response, err);
    }
  });
});

app.post('/new-task', (req, res) => {
  const newTask = req.body;

  fs.readFile(DB_FILE, (err, data) => {
    if (!err){
      const list = JSON.parse(data);
      const newId = 1 + Math.max(...list.reduce((result, task) => task.id ? result.concat(task.id) : result, [0]));

      Object.assign(newTask, { id: newId, completed: false });
      const newList = list.concat(newTask);
      
      fs.writeFile(DB_FILE, JSON.stringify(newList), (err) => {
        if (!err) {
          const response = 'Nowe zadanie zapisane';
          res.json({ newList, response });
          console.log(response);
        } else {
          const response = 'Błąd zapisu nowego zadania';
          res.json({ newList: list, response });
          console.log(response, err);
        }
      });
    } else {
      const response = 'Błąd odczytu bazy danych';
      console.log(response, err);
      res.json({ response });
    }
  });
  
});

app.post('/modify', (req, res) => {
  const modifiedTask = req.body;
  console.log(modifiedTask)
  
  fs.readFile(DB_FILE, (err, data) => {
    if (!err){
      const list = JSON.parse(data);
      const newList = list.map(task => {
        if (String(task.id) === modifiedTask.id) {
          Object.assign(task, modifiedTask, { id: Number(task.id) })
        }

        return task;
      });

      fs.writeFile(DB_FILE, JSON.stringify(newList), (err) => {
        if(!err) {
          const response = 'Modyfikacja zapisana';
          res.json({ response })
          console.log(response);
        } else {
          const response = 'Błąd przy zapisywaniu modyfikacji';
          res.json({ response });      
          console.log(response, err);
        }
      });
    } else {
      const response = 'Błąd odczytu bazy danych';
      res.json({ response });
      console.log(response, err);
    }
  });
});

app.post('/destroy', (req, res) => {
  const destoyedTaskId = Number(req.body.id);
  console.log(destoyedTaskId);

  fs.readFile(DB_FILE, (err, data) => {
    if (!err){
      const list = JSON.parse(data);
      const newList = list.filter(task => task.id !== destoyedTaskId);

      fs.writeFile(DB_FILE, JSON.stringify(newList), (err) => {
        if(!err) {
          const response = 'Zadanie usunięto';
          res.json({ newList, response })
          console.log(response);
        } else {
          const response = 'Błąd przy zapisywaniu do bazy danych';
          res.json({ response });      
          console.log(response, err);
        }
      });
    } else {
      const response = 'Błąd odczytu bazy danych';
      res.json({ response });
      console.log(response, err);
    }
  });
});

app.post('/list/completed', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      const list = JSON.parse(data);
      const newList = list.filter(task => task.completed === true);
      const response = 'Odczytano z bazy danych zadania o stausie completed';
      res.json({ newList, response });
      console.log(response);
    } else {
      const response = 'Błąd odczytu bazy danych';
      res.json({ response });
      console.log(response, err);
    }
  });
});

app.listen(3000, () => console.log('serwer stoi na porcie 3000'));