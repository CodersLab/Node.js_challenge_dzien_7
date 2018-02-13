const express = require('express');
const bodyParser = require('body-parser');
const fs = require("fs");

const app = express();

app.use(bodyParser.urlencoded());
app.use(express.static('./public/zadanieDnia/'));

const dbFile = "./public/zadanieDnia/data/todos.json";
let toDos = [];
let lastId = 0;

loadToDos();


app.get("/todos", (req, res) => {
    res.send(toDos);
});

app.delete("/todos/:id", (req, res) => {
    deleteToDos(parseInt(req.params.id));
    res.send(true);
});

app.post("/todos/:id/done", (req, res) => {
    changeStatus(parseInt(req.params.id));
    res.send(true);
});

app.put("/todos", (req, res) => {
    toDos = req.body.todos;
    toDos.forEach(todo => {
        todo.id = parseInt(todo.id);
        todo.done = (todo.done === "true");
    });
    saveToDos();
    loadToDos();
    res.send(true);
});

app.post("/todos/clear", () => {
   toDos = [];
   saveToDos();
});

app.listen(3000);


function deleteToDos(id) {
    toDos.forEach(todo => {
        if (todo.id === id) {
            toDos.splice(toDos.indexOf(todo), 1);
            saveToDos();
            loadToDos();
        }
    });
}

function loadToDos() {
    fs.readFile(dbFile, "utf-8", (err, data) => {
        if (err === null){
            toDos = JSON.parse(data);
            lastId = 0;
            if (toDos.length > 0) {
                toDos.forEach(el => {
                    if (el.id > lastId) {
                        lastId = el.id;
                    }
                });
            }
        }
        else {
            console.log('Błąd podczas odczytu pliku!', err);
        }
    });
}

function saveToDos() {
    fs.writeFile(dbFile, JSON.stringify(toDos), err => {
        if (err === null) {
            console.log("Zapisano wynik!");
        }
        else {
            console.log('Błąd podczas zapisu pliku!', err);
        }
    });
}

function changeStatus(id) {
    toDos.forEach(todo => {
        if (todo.id === id) {
            console.log('changed');
            todo.done = !todo.done;
            saveToDos();
            loadToDos();
        }
    });
}