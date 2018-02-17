const fs = require('fs');

const DB_FILE = './data/toDo/tasks.json';

const readFile = () => {

    return p = new Promise(function(resolve, reject) {  
        fs.readFile(DB_FILE, (err, data) => {
            if (!err){
                let taskList = JSON.parse(data);
                resolve(taskList);
            } else {
                reject(err);
            }
        });
     });
}

const writeFile = (inputData) => {

    return p = new Promise(function(resolve, reject) {  
        fs.writeFile(DB_FILE, inputData, (err, data) => {
            if (!err) {
                let taskList = JSON.parse(inputData);
                resolve(taskList)
            } else {
                res.send('Wystąpił błąd zapisu.');
            }
        });
    });
};


module.exports = {
    readFile,
    writeFile
};