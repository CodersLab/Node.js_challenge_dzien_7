// Twój kod
$(() => {
  console.log('skrypt załadowany');

  const newTask = $('.new-todo');
  const list = $('.todo-list');

  const addItem = (item) => {
    list.children().first().prepend($(`
    <li ${item.comleted ? 'completed' : null}>
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>${item.text + ' ' + item.id}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li>
    `));
  };

  const updateList = () => {
    $.ajax({
      url: '/list',
      headers: {
        'Content-Type': 'application/json',
      },
      type : 'POST',
      dataType : 'json'
    }).then((ans) => {
      console.log(ans);
      ans.forEach((item) => {
        addItem(item);
      })
    });
  }

  updateList();


  $(document).keypress(function(e) {
    if(e.which == 13) {
        $.ajax({
          url: '/new-task',
          data: JSON.stringify({
            text: newTask.val(),
          }),
          headers: {
              'Content-Type': 'application/json',
          },
          type : 'POST',
          dataType : 'json'
        }).then(ans => {
          updateList();
          console.log(ans);
        });
    }
  });
});