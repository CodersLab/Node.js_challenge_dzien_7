$(document).ready(function() {

    const taskListUrl = '/task/list';
    const newTaskUrl  = '/task';
    const listUl  = $('.todo-list');

    const readData = (url) =>  {
        $.ajax({
            url : url,
            dataType : 'json'
        })
        .done(ret => {
            console.log(ret);

            ret.tasks.forEach(element => {
               createTaskLi(element); 
            });
        });
    }

    readData(taskListUrl);

    const createTaskLi = (task) => {
        let li = $(`
                <li>
                    <div class="view">
                        <input class="toggle" type="checkbox">
                        <label>${task.title}</label>
                        <button class="destroy"></button>
                    </div>
                    <input class="edit" value="Rule the web">
                </li>
            `);
        listUl.append(li);
    }

    const newTask = $('.new-todo');

    newTask.on('click', () => {
       
    });

    const newTask = () => {

    }

    
});