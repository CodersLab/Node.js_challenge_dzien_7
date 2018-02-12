$(document).ready(function() {

    const url  = '/task';
    const listUl  = $('.todo-list');
    const loadedLi = $('.todo-list li');

    const readData = (url) =>  {
        $.ajax({
            url : url,
            dataType : 'json'
        })
        .done(ret => {
            ret.tasks.forEach((element, i) => {
               createTaskLi(element, i); 
            });

            addClickEvent(loadedLi);
        });
    }

    readData(url);

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
          }).done(ret => {
              let lastLiIndex = ret.tasks.length - 1;
              $('.todo-list li:last-child').attr('id', lastLiIndex);
          })
    }

    $(document).keypress(function (e) {
        if (e.which == 13) {

            taskModel = { 
                "title": newTaskInp.val(),
                "completed": false
             }

            newTask(url, taskModel);
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

            updateTaskEvent(url, eventTask);

            $(this).parent().parent().remove();

            addIndexes();
            
        });

        const completeLi = listLi.find('.toggle');

        completeLi.on('click', function(e){
            e.stopPropagation();

            let li = $(this).parent().parent();
            let completeValue = li.attr('data-complete');
            let liId = li.attr('id');
            let value = false;

            switch(completeValue){
                case "0":
                    value = true;
                    li.addClass('completed');
                    li.attr('data-complete', 1);
                    break;
                case "1":
                    value = false;
                    li.removeClass('completed')
                    li.attr('data-complete', 0);
                    break;
            }

            let eventTask = new UpdateTask(liId, 'PUT', value);
            updateTaskEvent(url, eventTask)
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

    let addIndexes = () => {

        const loadedLi = $('.todo-list li');

            i = 0;
            for(let li of loadedLi){
                li.id = i;
                i++;
            }
    }
    

    class UpdateTask {
        constructor(id, event, value){
            this.id = id,
            this.event = event,
            this.value = value
        }
    }

    
});