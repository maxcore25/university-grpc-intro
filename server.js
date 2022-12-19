const PROTO_PATH = './product.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});
var productProto = grpc.loadPackageDefinition(packageDefinition);
const { v4: uuidv4 } = require('uuid');
const server = new grpc.Server();

const products = [
  {
    id: '1',
    name: 'Лю-ля кебаб',
    brand: 'Джонджолли',
    amount: 1,
    isBought: false,
  },
  {
    id: '2',
    name: 'Вода',
    brand: 'Архыз',
    amount: 20,
    isBought: false,
  },
];
server.addService(productProto.ProductService.service, {
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
        details: 'Не найдено',
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
      existingProduct.brand = call.request.brand;
      existingProduct.amount = call.request.amount;
      existingProduct.isBought = call.request.isBought;
      callback(null, existingProduct);
    } else {
      callback({
        code: grpc.status.NOT_FOUND,
        details: 'Не найдено',
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
        details: 'Не найдено',
      });
    }
  },
});
server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure());
console.log('Сервер запущен по адресу http://127.0.0.1:50051');
server.start();
