const fs = require("fs");
const path = require("path");
const grpc = require("grpc");

const hello_proto = grpc.load('helloworld.proto').helloworld;

function sayHello(call, callback) {
    callback(null, {message: 'Hello ' + call.request.name});
}

function sayHelloAgain(call, callback) {
    callback(null, {message: 'Hello again, ' + call.request.name});
}

function main() {
    var server = new grpc.Server();
    server.addService(hello_proto.Greeter.service, {sayHello: sayHello, sayHelloAgain: sayHelloAgain});

    if (process.env.NODE_ENV === "production") {
        server.bind('0.0.0.0:50051', grpc.ServerCredentials.createSsl({
            rootCerts: fs.readFileSync(path.join(process.cwd(), "server-certs", "Snazzy_Microservices.crt")),
            keyCertPairs: {
                privateKey: fs.readFileSync(path.join(process.cwd(), "server-certs", "login.services.widgets.inc.key")),
                certChain: fs.readFileSync(path.join(process.cwd(), "server-certs", "login.services.widgets.inc.crt"))
            },
            checkClientCertificate: true
        }));
    } else {
        server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    }

    server.start();
    console.log("Server started");
}

main();
