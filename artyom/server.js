const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 3001;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'ami-abzalimov',
  password: 'MironovLab',
  database: 'stereogenedb'
});

connection.connect(err => {
  if (err) {
    console.error('DB error', err);
    return;
  }
  console.log('DB Success');
});

app.use(express.json());

app.get('/api/pair', (req, res) => {
  const { exp1, exp2 } = req.query;
  if (!exp1 || !exp2) {
    return res.status(400).json({ error });
  }
  
  const sql = 'SELECT metadata, statistics, chromData FROM correlations WHERE exp1 = ? AND exp2 = ?';
  connection.query(sql, [exp1, exp2], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'No data' });
    }
    const data = results[0];
    if (data.chromData) {
      try {
        data.chromData = JSON.parse(data.chromData);
      } catch (e) {
        console.error('Chrom error', e);
      }
    }
    res.json(data);
  });
});

app.get('/api/search', (req, res) => {
  const { experimentType, cellLine, correlationThreshold } = req.query;
  let sql = `SELECT exp1, exp2, correlation, type, cellLine FROM correlations WHERE 1=1`;
  let params = [];

  if (experimentType) {
    sql += ' AND type = ?';
    params.push(experimentType);
  }
  if (cellLine) {
    sql += ' AND cellLine = ?';
    params.push(cellLine);
  }
  if (correlationThreshold) {
    sql += ' AND correlation >= ?';
    params.push(correlationThreshold);
  }

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server port ${port}`);
});

