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
            ret.tasks.forEach((element, i) => {
               createTaskLi(element, i); 
            });

            const loadedLi = $('.todo-list li');

            addClickEvent(loadedLi);
        });
    }

    readData(taskListUrl);

    const createTaskLi = (task, i) => {

        let complete = '';
        let checked = '';
        let dataComplete = 0;

        if(task.completed){
            complete = 'completed';
            checked = 'checked';
            dataComplete = 1;
        }

        let li = $(`
                <li id="${i}" data-complete=${dataComplete} class="${complete}">
                    <div class="view">
                        <input class="toggle" type="checkbox" ${checked}>
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

    const addClickEvent = (listLi) => {

        const destroyLi = listLi.find('.destroy');

        destroyLi.on('click', function(e){

            e.stopPropagation();

            let liId = $(this).parent().parent().attr('id');

            let eventTask = new UpdateTask(liId, 'DELETE', 'true');

            updateTaskEvent(newTaskUrl, eventTask);

            $(this).parent().parent().remove();
        });

        const completeLi = listLi.find('.toggle');

        completeLi.on('click', function(e){
            e.stopPropagation();
            let liId = $(this).parent().parent().attr('id');

            let value = false;

            let completeValue = $(this).parent().parent().attr('data-complete');

            if(completeValue == 0){
                value = true;
            }

            
            let eventTask = new UpdateTask(liId, 'PUT', value);

            updateTaskEvent(newTaskUrl, eventTask)
        });
    }

    const updateTaskEvent = (url, eventTask) => {

        $.ajax({
            type: eventTask.event,
            url: url,
            data: JSON.stringify(eventTask),
            headers: {
                'Content-Type': 'application/json',
            },
            dataType: 'json'
          });

    };

    class UpdateTask {
        constructor(id, event, value){
            this.id = id,
            this.event = event,
            this.value = value
        }
    }

    
});