$(function() {
  const input = $('input.new-todo');
  const list = $('ul.todo-list');

  const update = (ans) => {
    console.log(ans.todos);
    let itemsLeft = ans.todos.filter(item => !item.complete).length;
    $('span.todo-count strong').text(itemsLeft);

    list.empty();
    ans.todos.forEach(item => {
      const completed = item.complete === true && 'class="completed"';
      let checked = item.complete === false && 'checked';
      list.append(`<li ${completed}>
            <div class="view">
                <input class="toggle" type="checkbox" ${checked}>
                <label>${item.todo}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit new-value" value="Create a TodoMVC template">
        </li>`);
    });

    $('.filters li a').click(function() {
      list.children().css("display", "block");
      $('.filters li a').removeClass("selected");
      let status = $(this)[0].innerText;
      if (status === "Active") {
        list.children().filter(".completed").css("display", "none");
        $(this).addClass("selected");
      } else if (status === "Completed") {
        list.children().not(".completed").css("display", "none");
        $(this).addClass("selected");
      } else {
        $(this).addClass("selected");
      }
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

    $('.view label').click(function() {
      let editBox = $(this).parent().siblings()[0];
      editBox.classList.toggle('edit');
      editBox.value = $(this)[0].innerText;
    });

    $('input.new-value').keypress((e) => {
      if (e.target.value && e.keyCode == 13) {

        let i = [],
          editTodo = [];
        $('input.new-value:not(.edit)').each(function() {
          i.push($(this).index('input.new-value'));
          editTodo.push($(this).val());
        });
        console.log('labels', i, editTodo);

        $('input.new-value').each(function() {
          $(this).addClass('edit');
        })

        $.ajax({
            url: '/edit',
            data: JSON.stringify({
              i,
              editTodo
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
  }

  $.ajax({
      url: '/show',
      headers: {
        'Content-Type': 'application/json',
      },
      type: 'GET',
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

  $('button.clear-completed').click(function() {
    console.log('cleared');
    $.ajax({
        url: '/clear',
        headers: {
          'Content-Type': 'application/json',
        },
        type: 'POST',
      })
      .then(ans => update(ans));
  });

});