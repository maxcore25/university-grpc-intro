const client = require('./client');

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  client.getAll(null, (err, data) => {
    if (!err) {
      res.render('customers', {
        results: data.customers,
      });
    }
  });
});

app.post('/save', (req, res) => {
  let newCustomer = {
    name: req.body.name,
    amount: req.body.amount,
    wasBought: req.body.wasBought,
  };

  client.insert(newCustomer, (err, data) => {
    if (err) throw err;

    console.log('Customer created successfully', data);
    res.redirect('/');
  });
});

app.post('/update', (req, res) => {
  const updateCustomer = {
    id: req.body.id,
    name: req.body.name,
    amount: req.body.amount,
    wasBought: req.body.wasBought,
  };

  client.update(updateCustomer, (err, data) => {
    if (err) throw err;

    console.log('Customer updated successfully', data);
    res.redirect('/');
  });
});

app.post('/remove', (req, res) => {
  client.remove({ id: req.body.customer_id }, (err, _) => {
    if (err) throw err;

    console.log('Customer removed successfully');
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
