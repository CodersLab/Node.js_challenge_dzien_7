// Twój kod
$(() => {
  const newTask = $('.new-todo');
  const list = $('.todo-list');
  const filterCompleted = $('#filter-completed');
  const filterAll = $('#filter-all');
  const filterActive = $('#filter-active');
  
  const addItem = task => {
    list.prepend($(`
    <li ${task.completed ? 'class=\"completed\"' : ''} id='${task.id}'>
      <div class="view">
        <input class="toggle" type="checkbox" ${task.completed ? 'checked' : ''} />
        <label>${task.text}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li>
    `));
  };
  
  const updateList = newList => {
    list.empty();
    newList.forEach(task => {
      addItem(task);
    });
    addTaskEventHandlers($('.todo-list li'));
  }
  
  const sendJsonReq = (url, data = {}, ...options) => {
    $.ajax({
      url,
      data: JSON.stringify(data),
      headers: { 'Content-type': 'application/json' },
      type: 'POST',
      dataType: 'json'
    }).then(({ newList, response }) => {
      if (newList) {
        updateList(newList);

        if (options && options.length > 0) {
          options.forEach(callback => callback());
        }
      }
      console.log(response);
    });
  }

  const addTaskEventHandlers = element => {
    //modify task
    element.dblclick(event => {
      console.log('onDblClick', event.target);
      $(event.target)
        .attr('contentEditable', true)
        .focus()
        .blur(event => {
          const id = event.target.parentNode.parentNode.id;
          const text = event.target.innerText;
        
          if (!text) {  //remove task if entire content deleted
            sendJsonReq('/destroy', { id });  
          } else {
            sendJsonReq('/modify', { id, text });
          }

          $(event.target).attr('contentEditable', false);
        })
        .keypress(event => {
          if(event.which == 13) {
            $(event.target).trigger('blur');
          }
        });
    });

    //delete task
    element.find('.destroy').click(event => {
      console.log(event.target.parentNode.parentNode.id)
      const id = event.target.parentNode.parentNode.id;

      sendJsonReq('/destroy', { id });
    });
    
    //set completed
    element.find('.toggle').change(event => {
      $(event.target.parentNode.parentNode).toggleClass('completed');
      const id = event.target.parentNode.parentNode.id;
      const isCompleted = $(event.target).is(':checked'); //safer than checking className for completed

      sendJsonReq('/modify', { id, completed: isCompleted })
    });
  }
  
  //add new task
  newTask
    .blur(event => {
      if (newTask.val()) { //add only if not empty
        sendJsonReq('/new-task', { text: newTask.val() });
        newTask.val('');
      }
    })
    .keypress(event => {
      if(event.which == 13) {
        newTask.trigger('blur');
      }
    });

  //show only completed
  filterCompleted.click(event => {
    event.preventDefault();

    sendJsonReq('/list/completed');
  });

  //initial list pull
  sendJsonReq('/list/all');
});