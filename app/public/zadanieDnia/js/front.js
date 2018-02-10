$(document).ready(function() {

    var taskListUrl = '/task/list';
    var listUl  = $('.todo-list');

    function readData(url) {
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

    function createTaskLi(task){
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

});