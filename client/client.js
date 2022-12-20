const PROTO_PATH = '../proto/product.proto';

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

const ProductService =
  grpc.loadPackageDefinition(packageDefinition).ProductService;
const client = new ProductService(
  'localhost:30043',
  grpc.credentials.createInsecure()
);

module.exports = client;
