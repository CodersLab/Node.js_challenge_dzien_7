const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/', express.static('./public/zadanieDnia/'));
app.use(cookieParser());

const db = './data/db.json';

app.post('/create', (req, res) => {
	fs.readFile(db, (err, data) => {
		if(err) return res.send('Wystąpił błąd odczytu bazy danych');
		
		const toDoList = JSON.parse(data);
		let id = toDoList.length + 1;
		
		toDoList.push({
			id,
			content: req.body.content,
			status: "new"
		});

		let newToDoList = JSON.stringify(toDoList);

		fs.writeFile(db, newToDoList, (err, data) => {
			if(err) return res.send('Wystąpił błąd zapisu do bazy danych');
			res.json(toDoList);
		});
	});
});

app.get('/read', (req, res) => {
	fs.readFile(db, (err, data) => {
		if(err) return res.send('Wystąpił błąd odczytu bazy danych');
		let toDoList = JSON.parse(data);
		res.json(toDoList);
	});
});

app.post('/update', (req, res) => {
	fs.readFile(db, (err, data) => {
		if(err) return res.send('error');
		
		const toDoList = JSON.parse(data);
		let id = req.body.id;
		let findRegistry = toDoList.filter(x => x.id == id);

		findRegistry.content = req.body.content;

		let newToDoList = Object.assingn(toDoList, findRegistry);

		newToDoList = JSON.stringify(newToDoList);

		fs.writeFile(db, newToDoList, (err, data) => {
			if(err) return res.json('error');
			res.json('ok');
		});
	});
});

app.post('/delete', (req, res) => {
	fs.readFile(db, (err, data) => {
		if(err) return res.json('error');
		const toDoList = JSON.parse(data);
		let id = req.body.id;
		
		let newToDoList = toDoList.filter(x => x.id != id);

		newToDoList = JSON.stringify(newToDoList);

		fs.writeFile(db, newToDoList, (err, data) => {
			if(err) return res.json('error');
			newToDoList = JSON.parse(newToDoList);
			res.json(newToDoList);
		});
	});
});

app.post('/toggle_status', (req, res) => {
	fs.readFile(db, (err, data) => {
		if(err) return res.send('error');
		
		const toDoList = JSON.parse(data);
		let id = req.body.id;

		toDoList.map(x => {
				if (x.id == id) {
					return x.status = req.body.status;
				}
		});
		
		updatedToDoList = JSON.stringify(toDoList);

		fs.writeFile(db, updatedToDoList, (err, data) => {
			if(err) return res.json('error');
			res.json('ok');
		});
	});
});

app.post('/clear_completed', (req, res) => {
	fs.readFile(db, (err, data) => {
		if(err) return res.send('error');
		const toDoList = JSON.parse(data);
		let clearList = toDoList.filter(x => x.status != 'completed');
		
		clearList = JSON.stringify(clearList);
		console.log(clearList)
		fs.writeFile(db, clearList, (err, data) => {
			if(err) return res.json('error');
			clearList = JSON.parse(clearList);
			res.json(clearList);
		});
	});
})

app.listen(3000, () => {
	console.log('Aplikacja działa na porcie 3000')
});