const express = require('express'),
  server = express(),
  fs = require('fs'),
  orderData = require('./orders'),
  cors = require('cors');

//orders is a json file that contains the data of the orders

server.set('port', process.env.PORT || 8000);
server.use(express.json());
server.use(cors());

server.get('/', (request, response) => {
  response.send('Welcome to our simple online order managing web app!');
});

server.get('/orders', (request, response) => {
  response.json(orderData);
});

server.get('/orders/:id', (request, response) => {
  const orderId = request.params.id;
  const order = orderData.orders.find((order) => order.id === orderId);
  if (order) {
    response.json(order);
  } else {
    response.status(404).send('Order not found');
  }
});

server.post('/orders', (request, response) => {
  const order = request.body;
  orderData.orders.push(order);
  saveOrders();
  response.status(201).json(order);
});

server.put('/orders/:id', (request, response) => {
  const orderId = request.params.id;
  const order = orderData.orders.find((order) => order.id === orderId);
  if (order) {
    order.state = request.body.state;
    saveOrders();
    response.json(order);
  } else {
    response.status(404).send('Order not found');
  }
});

server.delete('/orders/:id', (request, response) => {
  const orderId = request.params.id;
  const orderIndex = orderData.orders.findIndex(
    (order) => order.id === orderId,
  );
  if (orderIndex >= 0) {
    orderData.orders.splice(orderIndex, 1);
    saveOrders();
    response.status(204).send();
  } else {
    response.status(404).send('Order not found');
  }
});

server.listen(8000, () => {
  console.log('Express server started at port 8000');
});

function saveOrders() {
  fs.writeFileSync('./orders.json', JSON.stringify(orderData));
}
