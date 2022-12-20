const PROTO_PATH = './product.proto';
var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true,
});

var SubscriberService =
  grpc.loadPackageDefinition(packageDefinition).SubscriberService;
const client = new SubscriberService(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

module.exports = client;
