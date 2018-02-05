//Twój kod
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(express.static('./app/public/zadanieDnia/')); //czemu w przykładzie wystarczy ścieżka względna do przykladAjax.js, a tutaj potrzebuję ścieżki względem node-modules?

app.post('/', (req, res) => {
  console.log('req.body', req.body);
  res.json('ok');
});

app.listen(3000, () => console.log('serwer stoi na porcie 3000'));