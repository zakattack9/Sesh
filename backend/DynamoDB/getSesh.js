const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const dynamodb = new AWS.DynamoDB();

module.exports.getSesh = (event, context, callback) => {
  console.log("EVENT OBJ", event);
  let course = event.multiValueQueryStringParameters.course[0];
  console.log(course);

  let dynamoParams = {
    TableName: "Sesh",
    KeyConditionExpression: "#course = :course",
    ExpressionAttributeNames: {
      "#course": "course"
    },
    ExpressionAttributeValues: {
      ":course": { S: course }
    }
  };

  dynamodb.query(dynamoParams, (err, data) => {
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