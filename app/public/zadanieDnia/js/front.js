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
    list.prepend($(`
    <li ${task.comleted ? 'completed' : null} id='${task.id}'>
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>${task.text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li>
    `));
  };
  
  const addTaskEventHandlers = element => {
    const endModify = () => {
      const id = event.target.parentNode.parentNode.id;
      const text = event.target.innerText;
      
      $.ajax({
        url: '/modify',
        data: JSON.stringify({ id, text }),
        headers: JSON_AJAX.HEADERS,
        type: JSON_AJAX.TYPE,
        dataType: JSON_AJAX.DATATYPE
      }).then(({ newList, response }) => {
        console.log('newList', JSON.parse(newList));
        if (newList) {
          updateList(JSON.parse(newList));
        }
        console.log(response);
      });
      
      $(event.target).attr('contentEditable', false);
    }

    //edit task
    element.dblclick(event => {
      console.log('onDblClick', event.target);
      $(event.target)
      .attr('contentEditable', true)
      .focus()
      .keypress(event => {
        if(event.which == 13) {
          endModify();
        }
      })
      .blur(event => {
        endModify();
      });
    });

    //delete task
    element.find('.destroy').click(event => {
      console.log(event.target.parentNode.parentNode.id)
      const id = event.target.parentNode.parentNode.id;

      $.ajax({
        url: '/destroy',
        data: JSON.stringify({ id }),
        headers: JSON_AJAX.HEADERS,
        type: JSON_AJAX.TYPE,
        dataType: JSON_AJAX.DATATYPE
      }).then(({ newList, response }) => {
        console.log('newList', JSON.parse(newList));
        if (newList) {
          updateList(JSON.parse(newList));
        }
        console.log(response);
      });
    });
  }
  
  const updateList = newList => {
    //rerenders task list
    list.empty();
    newList.forEach(task => {
      addItem(task);
    });
    addTaskEventHandlers($('.todo-list li'));
  }

  //initial list pull
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
  });
  
  //add new task
  newTask.keypress(event => {
    if(event.which == 13) {
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
          newTask.val('');
        }
        console.log(response);
      });
    }
  });
});