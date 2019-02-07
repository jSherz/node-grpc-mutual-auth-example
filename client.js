const fs = require("fs");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

const packageDefinition = protoLoader.loadSync("helloworld.proto");
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  let client;

  if (process.env.NODE_ENV === "production") {
    const certsDir = path.join(process.cwd(), "client-certs");

    client = new hello_proto.Greeter(
      "localhost:50051",
      grpc.credentials.createSsl(
        [fs.readFileSync(path.join(certsDir, "Snazzy_Microservices.crt"))],
        fs.readFileSync(path.join(certsDir, "client-1010101.key")),
        fs.readFileSync(path.join(certsDir, "client-1010101.crt"))
      )
    );
  } else {
    client = new hello_proto.Greeter(
      "localhost:50051",
      grpc.credentials.createInsecure()
    );
  }

  client.sayHello({ name: "you" }, function(err, response) {
    err && console.error(err);

    console.log("Greeting:", response.message);
  });

  client.sayHelloAgain({ name: "you" }, function(err, response) {
    err && console.error(err);

    console.log("Greeting:", response.message);
  });
}

main();
