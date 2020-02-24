import * as AWS from "aws-sdk";
const textract = new AWS.Textract({ region: "us-west-2" });
const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || "";
const SNS_ROLE_ARN = process.env.SNS_ROLE_ARN || "";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const SQS_URL = process.env.SQS_URL || "";

export const handler = async (event: any = {}): Promise<any> => {
  console.log("ADD TO QUEUE");
  console.log("SNS_TOPIC_ARN");
  console.log(SNS_TOPIC_ARN);
  console.log("SNS_ROLE_ARN");
  console.log(SNS_ROLE_ARN);
  console.log("SQS_URL");
  console.log(SQS_URL);
  console.log(JSON.stringify(event, null, 4));

  // Pulls filename from event
  const filename = event["Records"][0]["s3"]["object"]["key"];

  // Short-circuit if filename isn't defined
  if (!filename) {
    console.log("ERROR - filename");
  }

  console.log("filename: " + filename);

  // // Defines params for Textract API call
  // const textractParams: AWS.Textract.AnalyzeDocumentRequest = {
  //   Document: {
  //     S3Object: {
  //       Bucket: S3_BUCKET_NAME,
  //       Name: filename
  //       // Version: "STRING_VALUE"
  //     }
  //   },
  //   FeatureTypes: ["TABLES", "FORMS"]
  // };

  // console.log("textractParams");
  // console.log(textractParams);

  // // // //
  // // // //

  var params = {
    DocumentLocation: {
      S3Object: {
        Bucket: S3_BUCKET_NAME,
        Name: filename
        // Version: "STRING_VALUE"
      }
    },
    // ClientRequestToken: filename,
    // JobTag: "FORM_04",
    NotificationChannel: {
      RoleArn: SNS_ROLE_ARN,
      SNSTopicArn: SNS_TOPIC_ARN
    }
  };

  console.log("params");
  console.log(params);

  await new Promise(resolve => {
    return textract.startDocumentTextDetection(params, function(err, data) {
      // if (err) console.log(err, err.stack);
      // an error occurred
      // else console.log(data); // successful response
      console.log("START DOCUMENT TEXT DETECTION");
      console.log("err");
      console.log(err);
      console.log("data");
      console.log(data);
      resolve(data);
    });
  });

  console.log("Function shut down");
  return;

  // // // //
  // // // //
  // SQS Code
  //
  // const sqs = new AWS.SQS({ endpoint: SQS_URL, region: "us-west-2"  });
  // var params: AWS.SQS.SendMessageRequest = {
  //   MessageBody: JSON.stringify({ text: "My Text Here" }),
  //   QueueUrl: SQS_URL,
  //   MessageAttributes: {
  //     name: {
  //       StringValue: "Request Name Here!",
  //       DataType: "String"
  //     }
  //   }
  //   // MessageGroupId: "TestMessageGroup"
  // };

  // SENDS MESSAGE ON QUEUE
  // await new Promise(resolve => {
  //   sqs.sendMessage(params, function(err, data) {
  //     console.log("SEND MESSAGE");
  //     console.log(err);
  //     console.log(data);
  //     resolve(data);

  //     // if (err) console.log(err, err.stack);
  //     // // an error occurred
  //     // else console.log(data); // successful response
  //   });
  // });
  //
  // // // //
  // // // //

  // Detect the document's text with Textract
  // await new Promise(resolve => {
  //   textract.startDocumentTextDetection(
  //     textractParams,
  //     async (err: any, data: any) => {
  //       console.log("DONE ANALYZING DOCUMENT");
  //       console.log(err);
  //       console.log(data);

  //       if (err) {
  //         console.log(err, err.stack);
  //         return;
  //       }

  //       // Debug Textract response
  //       console.log("Textract Response");
  //       console.log(JSON.stringify(data, null, 4));

  //       // Defines the item we're inserting into the database
  //       const item: any = {
  //         [PRIMARY_KEY]: filename.replace(".pdf", ""),
  //         // primary_contact_name: "John Doe"
  //         data: {
  //           ...data
  //         }
  //       };

  //       // Defines the params for db.put
  //       const dynamoParams = {
  //         TableName: TABLE_NAME,
  //         Item: item
  //       };

  //       // Inserts the record into the DynamoDB table
  //       await db.put(dynamoParams).promise();
  //       return resolve();
  //     }
  //   );
  // });

  // return;

  // // // //
  // // // //
  // // // //
  // // // //

  // Defines the item we're inserting into the database
  // const item: any = {
  //   [PRIMARY_KEY]: Math.random().toString(),
  //   primary_contact_name: "John Doe"
  // };

  // // Defines the params for db.put
  // const dynamoParams = {
  //   TableName: TABLE_NAME,
  //   Item: item
  // };

  // // Inserts the record into the DynamoDB table
  // return db.put(dynamoParams).promise();
};
