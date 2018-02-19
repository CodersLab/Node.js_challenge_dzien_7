// Twój kod
$(() => {
  const newTask = $('.new-todo');
  const list = $('.todo-list');
  const filterAllBtn = $('#filter-all');
  const filterCompletedBtn = $('#filter-completed');
  const filterActiveBtn = $('#filter-active');
  const clearBtn = $('.clear-completed');
  const leftToDos = $('.todo-count');
  
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

  const updateLeftTasks = (number) => {
    leftToDos.find('strong').text(number);
  };

  const updateList = newList => {
    list.empty();
    newList.forEach(task => {
      addItem(task);
    });
    addTaskEventHandlers($('.todo-list li'));
  };
  
  const sendJsonReq = (url, data = {}, ...options) => {
    $.ajax({
      url,
      data: JSON.stringify(data),
      headers: { 'Content-type': 'application/json' },
      type: 'POST',
      dataType: 'json'
    }).then(({ newList, response, activeTasks }) => {
      if (newList) {
        updateList(newList);
        if (options && options.length > 0) {
          options.forEach(callback => callback());
        }
      }
      updateLeftTasks(activeTasks);
      console.log(response);
    });
  };

  const addTaskEventHandlers = element => {
    //modify task
    element.on('dblclick touchstart', event => { //TODO make touch event fire only when no move detected
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
  };  
  
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

  /* filters */
  filterAllBtn.click(event => {
    event.preventDefault();

    sendJsonReq('/list/all');
    $('.filters').find('a').removeClass('selected');
    filterAllBtn.addClass('selected');
  });

  filterCompletedBtn.click(event => {
    event.preventDefault();

    sendJsonReq('/list/completed');
    $('.filters').find('a').removeClass('selected');
    filterCompletedBtn.addClass('selected');
  });
  
  filterActiveBtn.click(event => {
    event.preventDefault();

    sendJsonReq('/list/active');
    $('.filters').find('a').removeClass('selected');
    filterActiveBtn.addClass('selected');
  });

  //clear completed
  clearBtn.click(event => {
    event.preventDefault();

    sendJsonReq('/list/clear-completed')
    $('.filters').find('a').removeClass('selected');
    filterAllBtn.addClass('selected');
  });

  //initial list pull
  sendJsonReq('/list/all');
});