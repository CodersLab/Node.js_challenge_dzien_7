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

        let complete = '';

        if(task.completed){
            complete = 'completed';
        }

        let li = $(`
                <li class="${complete}">
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

    const newTaskInp = $('.new-todo');

    const newTask = (url, task) => {

        $.ajax({
            type: "POST",
            url: url,
            data: JSON.stringify(task),
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'json'
          });
    }

    $(document).keypress(function (e) {
        if (e.which == 13) {

            taskModel = { 
                "title": newTaskInp.val(),
                "completed": false
             }

            newTask(newTaskUrl, taskModel);
            createTaskLi(taskModel); 
            newTaskInp.val('');
        }
    });

    
});