const fs = require("fs");
const path = require("path");
const grpc = require("grpc");

const hello_proto = grpc.load('helloworld.proto').helloworld;

function main() {
    let client;

    if (process.env.NODE_ENV === "production") {
        client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createSsl(
            fs.readFileSync(path.join(process.cwd(), "client-certs", "Snazzy_Microservices.crt")),
            fs.readFileSync(path.join(process.cwd(), "client-certs", "client-1010101.key")),
            fs.readFileSync(path.join(process.cwd(), "client-certs", "client-1010101.crt"))
        ));
    } else {
        client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());
    }

    client.sayHello({name: 'you'}, function(err, response) {
        err && console.error(err);

        console.log('Greeting:', response.message);
    });

    client.sayHelloAgain({name: 'you'}, function(err, response) {
        err && console.error(err);

        console.log('Greeting:', response.message);
    });
}

main();
