$(function(){
    const todoListUl = $('ul.todo-list');
    const todoNumberSpan = $('span.todo-count strong');

    let itemsLeft = 0;
    let lastId = 0;
    let todosList = [];
    let body = $("body");

    loadToDos();

    body.on("click", "button.destroy", e => {
        e.preventDefault();
        deleteToDo($(e.target).data("id"));
    });

    body.on("click", ".view input.toggle", e => {
        toggleDone($(e.target).data("id"));
    });

    body.on("dblclick", ".view label", e => {
        let _this = $(e.target);
        let input = _this.parent().next();
        _this.hide();
        input.show();
        input.focus();
        input.on("blur", e => {
           input.hide();
           _this.text(input.val());
           _this.show();
           updateToDoText(parseInt(_this.next().data('id')), input.val());
           saveToDos();
        });
        input.keypress(e => {
            if (e.which === 13) {
                input.hide();
                _this.text(input.val());
                _this.show();
                updateToDoText(parseInt(_this.next().data('id')), input.val());
                saveToDos();
            }
        });
    });

    $("input.new-todo").keypress(e => {
        if (e.which === 13) {
            lastId++;
            todosList.push({"id":lastId,"text":$(e.target).val(),"done":false});
            $(e.target).val("");
            saveToDos();
            loadToDos();
        }
    });

    $("ul.filters a.completed").click((e) => {
        e.preventDefault();
        $("ul.filters a.selected").removeClass("selected");
        $(e.target).addClass("selected");
        todoListUl.find("li:not(.completed)").hide();
        todoListUl.find("li.completed").show();
    });

    $("ul.filters a.active").click((e) => {
        e.preventDefault();
        $("ul.filters a.selected").removeClass("selected");
        $(e.target).addClass("selected");
        todoListUl.find("li:not(.completed)").show();
        todoListUl.find("li.completed").hide();
    });

    $("ul.filters a.all").click((e) => {
        e.preventDefault();
        $("ul.filters a.selected").removeClass("selected");
        $(e.target).addClass("selected");
        todoListUl.find("li").show();
    });


    $("button.clear-completed").click(function () {
        $.ajax({
            url : '/todos/clear',
            type : 'POST',
        });
        todosList = [];
        itemsLeft = 0;
        todoListUl.empty();
        updateItemsLeft();
    });

    function loadToDos() {
        todoListUl.empty();
        $.ajax({
            url : '/todos',
            type : 'GET',
            dataType : 'json',
        }).then(ans => {
            itemsLeft = 0;
            todosList = ans;
            ans.forEach(ans => {

                if (!ans.done) {
                    itemsLeft++;
                }
                if (ans.id > lastId) {
                    lastId = ans.id;
                }

                let inputChecked = '';
                let liClass = '';
                if (ans.done) {
                    liClass = "completed";
                    inputChecked = "checked";
                }

                let template = '<li class="' + liClass + '" data-id="' + ans.id + '">\n' +
                    '               <div class="view">\n' +
                    '                    <input class="toggle" type="checkbox" data-id="' + ans.id + '" ' + inputChecked + '>\n' +
                    '                    <label>' + ans.text + '</label>\n' +
                    '                    <button class="destroy" data-id="' + ans.id + '"></button>\n' +
                    '                </div>\n' +
                    '                <input class="edit" value="' + ans.text + '">\n' +
                    '           </li>';

                todoListUl.append(template);
            });
            updateItemsLeft();
        });
    }

    function toggleDone(id) {
        $.ajax({
            url : '/todos/'+id+'/done',
            type : 'POST',
            dataType : 'json',
        });

        $("ul.todo-list").find("li[data-id='"+id+"']").toggleClass("completed");

        if ($("body").find("input.toggle[data-id='"+id+"']").is(":checked")) {
            itemsLeft--;
        }
        else {
            itemsLeft++;
        }
        updateItemsLeft();
    }

    function deleteToDo(id) {
        $.ajax({
            url : '/todos/'+id,
            type : 'DELETE',
            dataType : 'json',
        });
        $("ul.todo-list").find("li[data-id='"+id+"']").remove();
    }

    function updateToDoText(id, text) {
        console.log(todosList);
        todosList.forEach(el => {
            if (el.id === id) {
                el.text = text;
            }
        })
    }

    function updateItemsLeft() {
        todoNumberSpan.text(itemsLeft);
    }

    function saveToDos() {
        $.ajax({
            url : '/todos',
            type : 'PUT',
            dataType : 'json',
            data: {
                todos: todosList
            }
        });
    }
});