const fs = require('fs');

const DB_FILE = './data/toDo/tasks.json';

var readTaskList = () => {

    let taskList;

    fs.readFile(DB_FILE, (err, data) => {
        if (!err){
            let taskList = JSON.parse(data);
            
        } else {
            throw new Error("Bład zaladowania taskow");
        }
    });

    return taskList
}

module.exports.readTaskList  = readTaskList;