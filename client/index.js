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
      res.render('products', {
        results: data.products,
      });
    }
  });
});

app.post('/save', (req, res) => {
  let newProduct = {
    name: req.body.name,
    amount: req.body.amount,
    wasBought: req.body.wasBought,
  };

  client.insert(newProduct, (err, data) => {
    if (err) throw err;

    console.log('Product created successfully', data);
    res.redirect('/');
  });
});

app.post('/update', (req, res) => {
  const updateProduct = {
    id: req.body.id,
    name: req.body.name,
    amount: req.body.amount,
    wasBought: req.body.wasBought,
  };

  client.update(updateProduct, (err, data) => {
    if (err) throw err;

    console.log('Product updated successfully', data);
    res.redirect('/');
  });
});

app.post('/remove', (req, res) => {
  client.remove({ id: req.body.product_id }, (err, _) => {
    if (err) throw err;

    console.log('Product removed successfully');
    res.redirect('/');
  });
});

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
