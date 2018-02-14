const express = require('express');
const bodyParser = require('body-parser');
const reader = require('./reader/reader.js');
const fs = require('fs');

const DB_FILE = './data/toDo/tasks.json';

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.static('./public/zadanieDnia/'))

app.get('/task', (req, res) => {

    reader.readFile().then(
        val => res.send(val)
    );
    
});

app.post('/task', (req, res) => {

    let newTask = req.body;

    reader.readFile().then(
        (taskList) => {
            return JSON.stringify({ "tasks" : [...taskList.tasks, newTask]});
        }
    ).then((result) => {
        reader.writeFile(result).then(
            result => res.send(result)
        );
    });

});

app.delete('/task', (req, res) => {

    let eventTask = req.body;

    reader.readFile().then(
        (taskList) => {
            taskList.tasks.splice(eventTask.id, 1);
            return JSON.stringify({ "tasks" : [...taskList.tasks]});
        }
    ).then((result) => {
        reader.writeFile(result).then(
            result => res.send(result)
        );
    });

});

app.put('/task', (req, res) => {

    let eventTask = req.body;

    fs.readFile(DB_FILE, (err, data) => {
        if (!err){
            taskList = JSON.parse(data);

            let finded = taskList.tasks[eventTask.id];

            finded.completed = eventTask.value;

            let allTasks = { "tasks" : [...taskList.tasks]};

            let writeData = JSON.stringify(allTasks);

            fs.writeFile(DB_FILE, writeData, (err, data) => {
                if (!err) {
                    res.send('Dodano.');
                } else {
                    console.log('Błąd zapisu pliku', err);
                    res.send('Wystąpił błąd zapisu.');
                }
            });
        } else {
            throw new Error("Bład zaladowania taskow");
        }
    });

});

app.listen(3000, () => {
    console.log('Serwer uruchomiony na porcie 3000');
});