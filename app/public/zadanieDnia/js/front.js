$(function() {
  const input = $('input.new-todo')
  const list = $('ul.todo-list')

  $('.filters li a').click(function() {
    list.children().css("display", "block")
    $('.filters li a').removeClass("selected")
    let status = $(this)[0].innerText
    if (status === "Active") {
      list.children().filter(".completed").css("display", "none")
      $(this).addClass("selected")
    } else if (status === "Completed") {
      list.children().not(".completed").css("display", "none")
      $(this).addClass("selected")
    } else {
      $(this).addClass("selected")
    }
  })

  $('input.toggle').on('change', function() {
    const checked = this.checked;
    const id = $(this).next().next().attr('id')
    console.log('toggle id', id, checked)
    $.ajax({
      url: '/toggle/' + id + '/' + checked,
      type: 'PUT',
    }).then(() => {
      window.location.reload()
      this.checked = !checked
    })
  })

  $('button.destroy').click(function() {
    const id = this.id
    console.log('destroy id', id)
    $.ajax({
      url: '/todo/' + id,
      type: 'DELETE',
    }).then(() => {
      window.location.reload()
    })
  })

  $('.view label').click(function() {
    let editBox = $(this).parent().siblings()[0]
    editBox.classList.toggle('edit')
    editBox.value = $(this)[0].innerText
  })

  $('input.new-value').keypress((e) => {
    if (e.target.value && e.keyCode == 13) {
      let update = []
      $('input.new-value:not(.edit)').each(function() {
        update.push({
          id: $(this).prev().find('button').attr('id'),
          todo: $(this).val()
        })
      })
      console.log('update: ', update)
      $('input.new-value').each(function() {
        $(this).addClass('edit')
      })
      const update_json = JSON.stringify(update)
      $.ajax({
        url: '/edit/' + update_json,
        type: 'PUT',
      }).then(() => {
        window.location.reload()
      })
    }
  })

  $('button.clear-completed').click(function() {
    console.log('cleared')
    $.ajax({
      url: '/clear',
      type: 'DELETE',
    }).then(() => {
      window.location.reload()
    })
  })

})
