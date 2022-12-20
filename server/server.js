const PROTO_PATH = '../proto/product.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var productsProto = grpc.loadPackageDefinition(packageDefinition);

const { v4: uuidv4 } = require('uuid');

const server = new grpc.Server();
const products = [
  {
    id: 'a68b823c-7ca6-44bc-b721-fb4d5312cafc',
    name: 'Bread',
    amount: 100,
    wasBought: false,
  },
  {
    id: '34415c7c-f82d-4e44-88ca-ae2a1aaa92b7',
    name: 'Milk',
    amount: 50,
    wasBought: true,
  },
];

server.addService(productsProto.ProductService.service, {
  getAll: (_, callback) => {
    callback(null, { products: products });
  },

  get: (call, callback) => {
    let product = products.find(n => n.id == call.request.id);

    if (product) {
      callback(null, product);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Not found',
      });
    }
  },

  insert: (call, callback) => {
    let product = call.request;

    product.id = uuidv4();
    products.push(product);
    callback(null, product);
  },

  update: (call, callback) => {
    let existingProduct = products.find(n => n.id == call.request.id);

    if (existingProduct) {
      existingProduct.name = call.request.name;
      existingProduct.amount = call.request.amount;
      existingProduct.wasBought = call.request.wasBought;
      callback(null, existingProduct);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Not found',
      });
    }
  },

  remove: (call, callback) => {
    let existingProductIndex = products.findIndex(n => n.id == call.request.id);

    if (existingProductIndex != -1) {
      products.splice(existingProductIndex, 1);
      callback(null, {});
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Not found',
      });
    }
  },
});

server.bind('127.0.0.1:30043', grpc.ServerCredentials.createInsecure());
console.log('Server running at http://127.0.0.1:30043');
server.start();
