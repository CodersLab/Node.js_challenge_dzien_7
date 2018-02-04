let fullList = document.querySelector('.todo-list');
let newToDo = document.querySelector('.new-todo');
let destroyButtons;
let toggleCompletedButtons;
let clearCompleted = document.querySelector('.clear-completed');
let counterSelector = document.querySelector('.todo-count strong');
let todoCount = 0;
counterSelector.innerText = todoCount;
var filterBottomLink = document.querySelector('.filters');

function docFragment (id, status, content) {
	let statusLabel = status == "completed" ? 'class="completed"':null
	return (
		`<li ${statusLabel} id=${id}>
			<div class="view">
				<input class="toggle" type="checkbox">
				<label>${content}</label>
				<button class="destroy"></button>
			</div>
			<input class="edit" value="Rule the web">
		</li>`
	);
};

function create(value) {
	return fetch('/create', {
		method : 'POST',
		body : JSON.stringify({
			content: value
		}),
		headers: {
		'Content-Type': 'application/json',
		},
	});
};

function read() {
	return fetch('/read', {
		method : 'GET',
		headers: {
		'Content-Type': 'application/json',
		},
	});
	destroyButtons = document.querySelectorAll('.destroy'); 
};

function update() {
	return fetch('/read', {
		method : 'GET',
		headers: {
		'Content-Type': 'application/json',
		},
	});
};

function deletePost(id) {
	return fetch('/delete', {
		method : 'POST',
		body : JSON.stringify({
			id
		}),
		headers: {
		'Content-Type': 'application/json',
		},
	});
};

function toggleStatus(id, status) {
	fetch('/toggle_status', {
		method : 'POST',
		body : JSON.stringify({
			id,
			status
		}),
		headers: {
		'Content-Type': 'application/json',
		},
	});
};

function clearCompletedTask() {
	return fetch('/clear_completed', {
		method : 'POST',
		headers: {
		'Content-Type': 'application/json',
		},
	});
};

newToDo.addEventListener('keypress', (e) => {
	let key = e.keyCode;
	if(key === 13) {
		create(e.target.value)
		.then(res => res.json())
		.then(res => {
			let content = []
			res.forEach(x => {
				content.push(docFragment(x.id, x.status, x.content))
			});
			fullList.innerHTML = content.join('');
		});
		e.target.value = '';
	}
});

window.addEventListener('load', (e) => {
	read()
		.then(res => res.json())
		.then(res => {
			let content = []
			res.forEach(x => {
				content.push(docFragment(x.id, x.status, x.content))
				
				if (x.status != 'completed') {
					todoCount++;
					counterSelector.innerText = todoCount
				}
			});
			fullList.innerHTML = content.join('');
		});
});

window.addEventListener('click', (e) => {
	if (e.target.className === 'destroy') {
		deletePost(e.target.parentNode.parentNode.id)
			.then(res => res.json())
			.then(res => {
				let content = []
				res.forEach(x => {
					content.push(docFragment(x.id, x.status, x.content))
				});
				fullList.innerHTML = content.join('');
		});
	}
	switch (e.target.className) {
		case 'destroy':
			deletePost(e.target.parentNode.parentNode.id)
				.then(res => res.json())
				.then(res => {
					let content = []
					res.forEach(x => {
						content.push(docFragment(x.id, x.status, x.content))
					});
					fullList.innerHTML = content.join('');
			});
			break;
		case 'toggle':
			let idToggle = e.target.parentNode.parentNode.id
			let classList = e.target.parentNode.parentNode.classList;
			if (classList.contains('completed')) {
				classList.remove('completed');
				toggleStatus(idToggle, 'new');
				todoCount++;
				counterSelector.innerText = todoCount;
			} else {
				classList.add('completed');
				toggleStatus(idToggle, 'completed');
				todoCount--;
				counterSelector.innerText = todoCount;
			}
	}
});

clearCompleted.addEventListener('click', (e) => {
	clearCompletedTask()
		.then(res => res.json())
		.then(res => {
			let content = []
			res.forEach(x => {
				content.push(docFragment(x.id, x.status, x.content))
			});
			fullList.innerHTML = content.join('');
		});
});

window.addEventListener('hashchange', (e) => {
	let todoListSelector = document.querySelectorAll('.todo-list > li');
	switch (window.location.hash) {
		case '#/':
			[].forEach.call(todoListSelector, (x) => {
					x.style.display = '';
			});
			break;
		case '#/active':
			[].forEach.call(todoListSelector, (x) => {
				if (x.classList.contains('completed')) {
					x.style.display = 'none';
				}
			});
			break;
		case '#/completed':
			[].forEach.call(todoListSelector, (x) => {
				if (x.classList.contains('completed')) {
					x.style.display = '';
				} else {
					x.style.display = 'none';
				}
			});
			break;
	}
});

filterBottomLink.addEventListener('click', (e) => {
	document.querySelectorAll('.filters li').forEach(x => {
		x.children[0].classList.remove('selected');
	});
	e.target.classList.add('selected')
});