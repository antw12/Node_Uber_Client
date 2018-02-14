# Node-Uber-Client
#
 
 This project was built in conjunction with the Apache Storm and Spark project. It emulates a client sending data to RabbitMQ with the two applications consuming this data and inserting into a local Elastic Search instance. This client is wrote in node and uses the Rabbit package to publish the data to rabbit after being read in from the file holding the Uber entries.
 
# Technologies Used

 * NodeJS (https://nodejs.org/en/)
 * amqplib (http://www.squaremobius.net/amqp.node/channel_api.html)
 
# How To Download



# File To Parse 
 

 
# How To Run

 1. cd into the directory of the project 
 
 2. Run `node app.js`
 
 3. Confirm with the logs to make sure the application is running 
 
# Tests

 The two ways of testing this project are:
 
 1. Looking at the logs to make sure it is "sending" events and is able to iterate 
 
 2. Log into RabbitMQ UI and look at the exchange and queue making sure things are being published there