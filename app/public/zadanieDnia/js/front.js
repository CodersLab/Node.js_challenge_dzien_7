// Twój kod
$(() => {
  console.log('skrypt załadowany');

  const newTask = $('.new-todo');
  const list = $('.todo-list');
  const firstItem = list.firstItem

  const clearValue = (element) => element.val('');
  const addItem = (value) => {
    list.children().first().prepend($(`
    <li>
      <div class="view">
        <input class="toggle" type="checkbox">
        <label>${value}</label>
        <button class="destroy"></button>
      </div>
      <input class="edit" value="Rule the web">
    </li>
    `))
  };

  $(document).keypress(function(e) {
    if(e.which == 13) {
        $.ajax({
          data: JSON.stringify({
            id: 1,
            text: newTask.val(),
          }),
          headers: {
              'Content-Type': 'application/json',
          },
          type : 'POST',
          dataType : 'json'
        }).then(ans => {
          console.log(ans);
          addItem(newTask.val());
        });
    }
  });
});