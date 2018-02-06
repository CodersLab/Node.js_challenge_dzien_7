//Twój kod
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const DB_FILE = './app/data/zadanieDnia/db.json';

const app = express();

app.use(bodyParser.json());
app.use(express.static('./app/public/zadanieDnia/')); //czemu w przykładzie wystarczy ścieżka względna do przykladAjax.js, a tutaj potrzebuję ścieżki względem node-modules?

app.post('/list', (req, res) => {
  fs.readFile(DB_FILE, (err, data) => {
    if (!err) {
      res.json(JSON.parse(data));
    } else {
      res.json('Błąd odczytu pliku');
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
      const newList = JSON.stringify(list.concat(newTask));
      
      // console.log(newList);

      fs.writeFile(DB_FILE, newList, (err, data) => {
        if (!err) {
            console.log('Plik zapisany');
            res.json('Plik zapisany');
        } else {
            console.log('Błąd zapisu pliku', err);
            res.json('Błąd zapisu pliku');
        }
      });
    } else {
      console.log('Błąd odczytu pliku', err);
      res.json('Błąd odczytu pliku');
    }
  });
  
});



app.listen(3000, () => console.log('serwer stoi na porcie 3000'));