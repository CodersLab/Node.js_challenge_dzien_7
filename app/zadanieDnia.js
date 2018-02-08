const express = require('express');
const bodyParser = require('body-parser');
const reader = require('./reader/reader');
const fs = require('fs');

const DB_FILE = './data/toDo/tasks.json';

const app = express();
app.use(bodyParser.urlencoded());

app.use(express.static('./public/zadanieDnia/'))

app.get('/task/list', (req, res) => {
    
    fs.readFile(DB_FILE, (err, data) => {
        if (!err){
            taskList = JSON.parse(data);
            res.send(taskList);
        } else {
            throw new Error("Bład zaladowania taskow");
        }
    });
    
});

app.listen(3000, () => {
    console.log('Serwer uruchomiony na porcie 3000');
});