// Twój kod
$(() => {
  const newTask = $('.new-todo');
  const list = $('.todo-list');
  const JSON_AJAX = {
    HEADERS: { 'Content-type': 'application/json' },
    TYPE: 'POST',
    DATATYPE: 'json'
}

  const addItem = task => {
    list.children().first().prepend($(`
    <li ${task.comleted ? 'completed' : null} id='${task.id}'>
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>${task.id + ' ' + task.text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li>
    `));
  };

  const updateList = newList => {
    newList.forEach(task => {
      addItem(task);
    });
  }

  (() => {
    $.ajax({
      url: '/list',
      headers: JSON_AJAX.HEADERS,
      type: JSON_AJAX.TYPE,
      dataType: JSON_AJAX.DATATYPE
    }).then(({ newList, response }) => {
      if (newList) {
        updateList(newList);
      }
      console.log(response);
    }).then(() => {
      $(document).keypress(function(e) {
        if(e.which == 13) {
            $.ajax({
              url: '/new-task',
              data: JSON.stringify({
                text: newTask.val(),
              }),
              headers: JSON_AJAX.HEADERS,
              type: JSON_AJAX.TYPE,
              dataType: JSON_AJAX.DATATYPE
            }).then(({ newList, response }) => {
              if (newList) {
                updateList(newList);
              }
              console.log(response);
            });
        }
      });
    
      
      $('.todo-list li').dblclick(event => {
        const taskId = event.target.parentNode.parentNode.id;
        const taskText = event.target.innerText;
        console.log(taskText);
        $(event.target).attr('contentEditable', true).focus();
      });
    })
  })()

});