const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

const
  connection = mysql.createConnection('mysql://user:111@localhost/northwind');

connection.connect(function (err) {
  if (err) {
    console.error('Ошибка подключения к базе данных: ' + err.stack);
    return;
  }

  console.log('Подключение к базе данных успешно установлено!');
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/:table_name', function (req, res) {
  const tableName = req.params.table_name;
  const sql = `SELECT * FROM ${tableName}`;
  connection.query(sql, [], function (err, results) {
    if (err) throw err;
    const data = results;
    if (!data) {
      res.status(404).send(`${tableName} not found.`);
    } else {
      res.json(data);
    }
  });
});

app.get('/:table_name/:id', function (req, res) {
  const id = req.params.id;
  const tableName = req.params.table_name;
  const sql = `SELECT * FROM ${tableName} WHERE id = ?`;
  connection.query(sql, [id], function (err, results) {
    if (err) throw err;
    const data = results[0];
    if (!data) {
      res.status(404).send(`ID ${id} not found.`);
    } else {
      res.json(data);
    }
  });
});

const port = 3000;
app.listen(port, function () {
  console.log('Сервер запущен на http://localhost:' + port);
});