const fs = require("fs");
const path = require("path");
const protoLoader = require("@grpc/proto-loader");
const grpc = require("grpc");

const packageDefinition = protoLoader.loadSync("helloworld.proto");
const hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

function sayHelloAgain(call, callback) {
  callback(null, { message: "Hello again, " + call.request.name });
}

function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {
    sayHello: sayHello,
    sayHelloAgain: sayHelloAgain
  });

  const certsDir = path.join(process.cwd(), "server-certs");

  if (process.env.NODE_ENV === "production") {
    server.bind(
      "0.0.0.0:50051",
      grpc.ServerCredentials.createSsl({
        rootCerts: fs.readFileSync(
          path.join(certsDir, "Snazzy_Microservices.crt")
        ),
        keyCertPairs: [
          {
            privateKey: fs.readFileSync(
              path.join(
                certsDir,
                "server-certs",
                "login.services.widgets.inc.key"
              )
            ),
            certChain: fs.readFileSync(
              path.join(
                certsDir,
                "server-certs",
                "login.services.widgets.inc.crt"
              )
            )
          }
        ],
        checkClientCertificate: true
      })
    );
  } else {
    server.bind("0.0.0.0:50051", grpc.ServerCredentials.createInsecure());
  }

  server.start();
  console.log("Server started");
}

main();
