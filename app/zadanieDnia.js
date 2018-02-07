//Twój kod
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const DB_FILE = './app/data/zadanieDnia/db.json';

const app = express();

app.use(bodyParser.json());
app.use(express.static('./app/public/zadanieDnia/'));

app.post('/list', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err){
      const newList = JSON.parse(data);
      const response = 'Baza danych odczytana';
      console.log(newList);
      res.json({ newList, response });
      console.log(response);
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
      const newId = 1 + Math.max(...list.reduce((result, task) => {
        const id = task.id;

        return id ? result.concat(id) : result;
      }, [0]));

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

  fs.readFile(DB_FILE, (err, data) => {
    if (!err){
      const list = JSON.parse(data);
      const newList = data.map(task => task.id === modifiedTask.id ? modifiedTask : task);

      fs.writeFile(DB_FILE, newList, (err) => {
        if(!err) {
          const response = 'Modyfikacja zapisana';
          res.json({ newList, response })
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


app.listen(3000, () => console.log('serwer stoi na porcie 3000'));