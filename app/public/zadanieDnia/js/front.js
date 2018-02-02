$(function() {
  const input = $('input.new-todo');
  const list = $('ul.todo-list');

  const update = (ans) => {
    console.log(ans.todos);
    list.empty();
    ans.todos.forEach(item => {
      const completed = item.complete === true && 'class="completed"';
      list.append(`<li ${completed}>
            <div class="view">
                <input class="toggle" type="checkbox">
                <label>${item.todo}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="Create a TodoMVC template">
        </li>`);      
    });
    
    $('input.toggle').on('change', function() {
      const i = $(this).index('input.toggle');
      console.log('toggle id', i);
      $.ajax({
          url: '/toggle',
          data: JSON.stringify({
            i,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          type: 'POST',
          dataType: 'json',
        })
        .then(ans => update(ans));
    });
    
    $('button.destroy').click(function() {
      const i = $(this).index('button.destroy');
      console.log('destroy id', i);
      $.ajax({
          url: '/destroy',
          data: JSON.stringify({
            i,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          type: 'POST',
          dataType: 'json',
        })
        .then(ans => update(ans));
    });
    
  }

  $.ajax({
      url: '/show',
      headers: {
        'Content-Type': 'application/json',
      },
      type: 'GET',
      dataType: 'json',
    })
    .then(ans => update(ans));

  input.on('keypress', (e) => {
    if (e.target.value && e.keyCode == 13) {
      const todo = input.val();
      input.val("");

      $.ajax({
          url: '/add',
          data: JSON.stringify({
            todo,
            complete: false
          }),
          headers: {
            'Content-Type': 'application/json',
          },
          type: 'POST',
          dataType: 'json',
        })
        .then(ans => update(ans));
    }
  });



});