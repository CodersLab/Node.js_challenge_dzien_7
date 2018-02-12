const fs = require('fs');

const DB_FILE = './data/toDo/tasks.json';

const readFile = () => {

    return p = new Promise(function(resolve, reject) {  

        let taskList;

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

const writeFile = () => {

};


module.exports = {
    readFile
};