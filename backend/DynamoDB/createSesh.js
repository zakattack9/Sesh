const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const dynamodb = new AWS.DynamoDB();

module.exports.createSesh = (event, context, callback) => {
  console.log("hello", event.body);
  let { course, time, location, locationDetails, seshDetails } = JSON.parse(event.body);
  console.log(course, time, location, locationDetails, seshDetails);

  var dynamoParams = {
    Item: {
      "course": {
        S: course
      },
      "location": {
        S: location
      },
      "time": {
        S: time
      },
      "locationDetails": {
        S: locationDetails
      },
      "seshDetails": {
        S: seshDetails
      },
    },
    TableName: "Sesh"
  };

  dynamodb.putItem(dynamoParams, (err, data) => {
    if (err) {
      console.log(err, err.stack);
      const response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(err.stack)
      }
      callback(null, response);
    } else {
      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(data)
      }
      callback(null, response);
    }
  });

};