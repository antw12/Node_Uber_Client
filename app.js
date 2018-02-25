let express = require('express');
let fs = require('fs');
let async = require('async');
let amqp = require('amqplib/callback_api');

const exchange =  "uber_data_exchange";
const queue = "uber_queue";

let app = express();
amqp.connect('amqp://localhost', '', (err, conn) =>{
    if (err) {
        console.log("Error from amqp: ", err);
        process.exit(1);
    }
    conn.createConfirmChannel((err, chan) => {
        if (err) {
            console.log("Error creating channel: ", err);
            process.exit(1);
        }
        chan.assertExchange(exchange, 'fanout', {"confirm":true}, (err, ok) => {
            if(err) {
                console.log("Error creating exchange:" , err);
                process.exit(1);
            }
            if (ok) {
                console.log("Exchange created");
                chan.assertQueue(queue, {}, (err, ok) => {
                    if(err) {
                        console.log("Error creating queue:" , err);
                        process.exit(1);
                    }
                    if(ok) {
                        console.log("Queue created");
                        chan.bindQueue(queue, exchange, '', {}, (err, ok) => {
                            if (err) {
                                console.log("Error binding queue:", err);
                                process.exit(1);
                            }
                            if(ok) {
                                console.log("ready to publish messages");
                                fs.readFile('uber-raw-data-may14.csv', (err, data) => {
                                    if (err) process.exit(1);
                                    let count = 1;
                                    let fileContent = data.toString();
                                    async.eachLimit(
                                        fileContent.split(/\r?\n/),
                                        1000,
                                        function (entry, finish) {
                                            process.nextTick(() => {
                                                chan.publish(exchange, '', Buffer.from(entry), {}, (err, ok) => {
                                                    if (err) process.exit(1);
                                                    console.log(count++);
                                                    finish();
                                                });
                                            })
                                        }, (err) => {
                                            if (err) {
                                                console.log('error running eachLimit()');
                                                throw err;
                                            }
                                            console.log("done now closing connection");
                                            conn.close((err) => {
                                                if (err) {
                                                    console.log('failed to close');
                                                    throw err;
                                                }
                                            });
                                        });
                                });
                            }
                        });
                    }
                });
            }
        });
    });
});

module.exports = app;