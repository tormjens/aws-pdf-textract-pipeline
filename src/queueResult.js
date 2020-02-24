"use strict";
// {
//   "Records": [
//     {
//       "EventSource": "aws:sns",
//       "EventVersion": "1.0",
//       "EventSubscriptionArn": "arn:aws:sns:us-west-2:839811712080:LambdaCronExample-MyTopic86869434-GNU4OYHJJK2B:2835b150-7b7c-4701-b345-1a26aa997ba0",
//       "Sns": {
//         "Type": "Notification",
//         "MessageId": "a0fcdb52-33c5-5e75-a29d-8d9f16c6efa0",
//         "TopicArn": "arn:aws:sns:us-west-2:839811712080:LambdaCronExample-MyTopic86869434-GNU4OYHJJK2B",
//         "Subject": null,
//         "Message": "{\"JobId\":\"8ace6713ef0f85fbd88294d4f50b5063ad08052f93da760e98da55668f3e1148\",\"Status\":\"SUCCEEDED\",\"API\":\"StartDocumentTextDetection\",\"Timestamp\":1582506691353,\"DocumentLocation\":{\"S3ObjectName\":\"5055255.pdf\",\"S3Bucket\":\"lambdacronexample-cogccpdfdownloadsbucket93b40e01-1kn95iu6zt174\"}}",
//         "Timestamp": "2020-02-24T01:11:31.395Z",
//         "SignatureVersion": "1",
//         "Signature": "drLfHmCEegFSc4oLYO/5y8ouKkHQLEsDo2l9tFFFtUGTUcbnIhFHYvQfbTND9BxE8a18kZ+nDBHuLlNhF67oVW0B2I8oy3svlYc6oeRUcgg6wF8TqlPpBwsG+UCnP81OIjtcb0VutqeYonlg8EDuXYK/pPumDsQ1NIkKjfwncdLPJLsgiuZZOkkRnvui5qftLSRkXtI1EXdwhIIXNyU3jK0MhEWZ/69K2mpZRSkb1jy2nkfQi1zlhktF4AfQpq4bMVxaBTq36Hb4FXXpzcPO2CLN2XchAIszd4vDAiEy9oSKJIW0IxqY5bazk70/lCva+AaMHoUAUazHHXamOZC4nw==",
//         "SigningCertUrl": "https://sns.us-west-2.amazonaws.com/SimpleNotificationService-a86cb10b4e1f29c941702d737128f7b6.pem",
//         "UnsubscribeUrl": "https://sns.us-west-2.amazonaws.com/?Action=Unsubscribe&SubscriptionArn=arn:aws:sns:us-west-2:839811712080:LambdaCronExample-MyTopic86869434-GNU4OYHJJK2B:2835b150-7b7c-4701-b345-1a26aa997ba0",
//         "MessageAttributes": {}
//       }
//     }
//   ]
// }
Object.defineProperty(exports, "__esModule", { value: true });
// // // //
const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient();
const textract = new AWS.Textract({ region: "us-west-2" });
const TABLE_NAME = process.env.TABLE_NAME || "";
const PRIMARY_KEY = process.env.PRIMARY_KEY || "";
// const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || "";
// const SNS_ROLE_ARN = process.env.SNS_ROLE_ARN || "";
// const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
// const SQS_URL = process.env.SQS_URL || "";
// const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN || "";
// const SNS_ROLE_ARN = process.env.SNS_ROLE_ARN || "";
exports.handler = async (event = {}) => {
    console.log("QUEUE RESULT");
    // console.log(SNS_TOPIC_ARN);
    // console.log(SNS_ROLE_ARN);
    console.log(JSON.stringify(event, null, 4));
    // return;
    let JobId = "";
    try {
        JobId = event["Records"][0]["Sns"]["Message"];
        console.log("parsed jobid struct from event");
        console.log(JobId);
        console.log(JSON.parse(JobId));
        const jobIDStruct = JSON.parse(JobId);
        JobId = jobIDStruct["JobId"];
    }
    catch (e) {
        console.log("ERROR PARSING JOB ID");
        console.log(e);
    }
    // Log JobID
    console.log("JobId");
    console.log(JobId);
    var params = {
        JobId
        // MaxResults: 1
        // NextToken: "STRING_VALUE"
    };
    console.log(params);
    await new Promise(resolve => {
        // textract.getDocumentAnalysis(params, function(err: any, data: any) {
        textract.getDocumentTextDetection(params, function (err, data) {
            console.log("err, err.stack");
            console.log(err);
            // an error occurred
            console.log("data"); // successful response
            console.log(data); // successful response
            resolve(data);
            // Defines the item we're inserting into the database
            const item = {
                [PRIMARY_KEY]: JobId,
                data: {
                    ...data
                }
            };
            // Defines the params for db.put
            const dynamoParams = {
                TableName: TABLE_NAME,
                Item: item
            };
            // Inserts the record into the DynamoDB table
            return db.put(dynamoParams).promise();
        });
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWVSZXN1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJxdWV1ZVJlc3VsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBSTtBQUNKLGlCQUFpQjtBQUNqQixRQUFRO0FBQ1Isa0NBQWtDO0FBQ2xDLCtCQUErQjtBQUMvQiwwSkFBMEo7QUFDMUosaUJBQWlCO0FBQ2pCLGtDQUFrQztBQUNsQywrREFBK0Q7QUFDL0QsMkdBQTJHO0FBQzNHLDJCQUEyQjtBQUMzQiw4VUFBOFU7QUFDOVUsbURBQW1EO0FBQ25ELG1DQUFtQztBQUNuQyxtWEFBbVg7QUFDblgsa0lBQWtJO0FBQ2xJLDhOQUE4TjtBQUM5TixrQ0FBa0M7QUFDbEMsVUFBVTtBQUNWLFFBQVE7QUFDUixNQUFNO0FBQ04sSUFBSTs7QUFFSixXQUFXO0FBRVgsK0JBQStCO0FBQy9CLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFFBQVEsQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUM3QyxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQztBQUMzRCxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxFQUFFLENBQUM7QUFDaEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO0FBQ2xELHlEQUF5RDtBQUN6RCx1REFBdUQ7QUFDdkQsMkRBQTJEO0FBQzNELDZDQUE2QztBQUM3Qyx5REFBeUQ7QUFDekQsdURBQXVEO0FBRTFDLFFBQUEsT0FBTyxHQUFHLEtBQUssRUFBRSxRQUFhLEVBQUUsRUFBZ0IsRUFBRTtJQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzVCLDhCQUE4QjtJQUM5Qiw2QkFBNkI7SUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QyxVQUFVO0lBRVYsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0lBQ2YsSUFBSTtRQUNGLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDOUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO1FBQzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDbkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxLQUFLLEdBQUcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0tBQzlCO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNoQjtJQUVELFlBQVk7SUFDWixPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFbkIsSUFBSSxNQUFNLEdBQVE7UUFDaEIsS0FBSztRQUNMLGdCQUFnQjtRQUNoQiw0QkFBNEI7S0FDN0IsQ0FBQztJQUVGLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFFcEIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUMxQix1RUFBdUU7UUFDdkUsUUFBUSxDQUFDLHdCQUF3QixDQUFDLE1BQU0sRUFBRSxVQUFTLEdBQVEsRUFBRSxJQUFTO1lBQ3BFLE9BQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLG9CQUFvQjtZQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsc0JBQXNCO1lBQzNDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxzQkFBc0I7WUFDekMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBRWQscURBQXFEO1lBQ3JELE1BQU0sSUFBSSxHQUFRO2dCQUNoQixDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUs7Z0JBQ3BCLElBQUksRUFBRTtvQkFDSixHQUFHLElBQUk7aUJBQ1I7YUFDRixDQUFDO1lBRUYsZ0NBQWdDO1lBQ2hDLE1BQU0sWUFBWSxHQUFHO2dCQUNuQixTQUFTLEVBQUUsVUFBVTtnQkFDckIsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDO1lBRUYsNkNBQTZDO1lBQzdDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLy8ge1xuLy8gICBcIlJlY29yZHNcIjogW1xuLy8gICAgIHtcbi8vICAgICAgIFwiRXZlbnRTb3VyY2VcIjogXCJhd3M6c25zXCIsXG4vLyAgICAgICBcIkV2ZW50VmVyc2lvblwiOiBcIjEuMFwiLFxuLy8gICAgICAgXCJFdmVudFN1YnNjcmlwdGlvbkFyblwiOiBcImFybjphd3M6c25zOnVzLXdlc3QtMjo4Mzk4MTE3MTIwODA6TGFtYmRhQ3JvbkV4YW1wbGUtTXlUb3BpYzg2ODY5NDM0LUdOVTRPWUhKSksyQjoyODM1YjE1MC03YjdjLTQ3MDEtYjM0NS0xYTI2YWE5OTdiYTBcIixcbi8vICAgICAgIFwiU25zXCI6IHtcbi8vICAgICAgICAgXCJUeXBlXCI6IFwiTm90aWZpY2F0aW9uXCIsXG4vLyAgICAgICAgIFwiTWVzc2FnZUlkXCI6IFwiYTBmY2RiNTItMzNjNS01ZTc1LWEyOWQtOGQ5ZjE2YzZlZmEwXCIsXG4vLyAgICAgICAgIFwiVG9waWNBcm5cIjogXCJhcm46YXdzOnNuczp1cy13ZXN0LTI6ODM5ODExNzEyMDgwOkxhbWJkYUNyb25FeGFtcGxlLU15VG9waWM4Njg2OTQzNC1HTlU0T1lISkpLMkJcIixcbi8vICAgICAgICAgXCJTdWJqZWN0XCI6IG51bGwsXG4vLyAgICAgICAgIFwiTWVzc2FnZVwiOiBcIntcXFwiSm9iSWRcXFwiOlxcXCI4YWNlNjcxM2VmMGY4NWZiZDg4Mjk0ZDRmNTBiNTA2M2FkMDgwNTJmOTNkYTc2MGU5OGRhNTU2NjhmM2UxMTQ4XFxcIixcXFwiU3RhdHVzXFxcIjpcXFwiU1VDQ0VFREVEXFxcIixcXFwiQVBJXFxcIjpcXFwiU3RhcnREb2N1bWVudFRleHREZXRlY3Rpb25cXFwiLFxcXCJUaW1lc3RhbXBcXFwiOjE1ODI1MDY2OTEzNTMsXFxcIkRvY3VtZW50TG9jYXRpb25cXFwiOntcXFwiUzNPYmplY3ROYW1lXFxcIjpcXFwiNTA1NTI1NS5wZGZcXFwiLFxcXCJTM0J1Y2tldFxcXCI6XFxcImxhbWJkYWNyb25leGFtcGxlLWNvZ2NjcGRmZG93bmxvYWRzYnVja2V0OTNiNDBlMDEtMWtuOTVpdTZ6dDE3NFxcXCJ9fVwiLFxuLy8gICAgICAgICBcIlRpbWVzdGFtcFwiOiBcIjIwMjAtMDItMjRUMDE6MTE6MzEuMzk1WlwiLFxuLy8gICAgICAgICBcIlNpZ25hdHVyZVZlcnNpb25cIjogXCIxXCIsXG4vLyAgICAgICAgIFwiU2lnbmF0dXJlXCI6IFwiZHJMZkhtQ0VlZ0ZTYzRvTFlPLzV5OG91S2tIUUxFc0RvMmw5dEZGRnRVR1RVY2JuSWhGSFl2UWZiVE5EOUJ4RThhMThrWituREJIdUxsTmhGNjdvVlcwQjJJOG95M3N2bFljNm9lUlVjZ2c2d0Y4VHFsUHBCd3NHK1VDblA4MU9JanRjYjBWdXRxZVlvbmxnOEVEdVhZSy9wUHVtRHNRMU5Ja0tqZnduY2RMUEpMc2dpdVpaT2trUm52dWk1cWZ0TFNSa1h0STFFWGR3aElJWE55VTNqSzBNaEVXWi82OUsybXBaUlNrYjFqeTJua2ZRaTF6bGhrdEY0QWZRcHE0Yk1WeGFCVHEzNkhiNEZYWHB6Y1BPMkNMTjJYY2hBSXN6ZDR2REFpRXk5b1NLSklXMEl4cVk1YmF6azcwL2xDdmErQWFNSG9VQVVhekhIWGFtT1pDNG53PT1cIixcbi8vICAgICAgICAgXCJTaWduaW5nQ2VydFVybFwiOiBcImh0dHBzOi8vc25zLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tL1NpbXBsZU5vdGlmaWNhdGlvblNlcnZpY2UtYTg2Y2IxMGI0ZTFmMjljOTQxNzAyZDczNzEyOGY3YjYucGVtXCIsXG4vLyAgICAgICAgIFwiVW5zdWJzY3JpYmVVcmxcIjogXCJodHRwczovL3Nucy51cy13ZXN0LTIuYW1hem9uYXdzLmNvbS8/QWN0aW9uPVVuc3Vic2NyaWJlJlN1YnNjcmlwdGlvbkFybj1hcm46YXdzOnNuczp1cy13ZXN0LTI6ODM5ODExNzEyMDgwOkxhbWJkYUNyb25FeGFtcGxlLU15VG9waWM4Njg2OTQzNC1HTlU0T1lISkpLMkI6MjgzNWIxNTAtN2I3Yy00NzAxLWIzNDUtMWEyNmFhOTk3YmEwXCIsXG4vLyAgICAgICAgIFwiTWVzc2FnZUF0dHJpYnV0ZXNcIjoge31cbi8vICAgICAgIH1cbi8vICAgICB9XG4vLyAgIF1cbi8vIH1cblxuLy8gLy8gLy8gLy9cblxuaW1wb3J0ICogYXMgQVdTIGZyb20gXCJhd3Mtc2RrXCI7XG5jb25zdCBkYiA9IG5ldyBBV1MuRHluYW1vREIuRG9jdW1lbnRDbGllbnQoKTtcbmNvbnN0IHRleHRyYWN0ID0gbmV3IEFXUy5UZXh0cmFjdCh7IHJlZ2lvbjogXCJ1cy13ZXN0LTJcIiB9KTtcbmNvbnN0IFRBQkxFX05BTUUgPSBwcm9jZXNzLmVudi5UQUJMRV9OQU1FIHx8IFwiXCI7XG5jb25zdCBQUklNQVJZX0tFWSA9IHByb2Nlc3MuZW52LlBSSU1BUllfS0VZIHx8IFwiXCI7XG4vLyBjb25zdCBTTlNfVE9QSUNfQVJOID0gcHJvY2Vzcy5lbnYuU05TX1RPUElDX0FSTiB8fCBcIlwiO1xuLy8gY29uc3QgU05TX1JPTEVfQVJOID0gcHJvY2Vzcy5lbnYuU05TX1JPTEVfQVJOIHx8IFwiXCI7XG4vLyBjb25zdCBTM19CVUNLRVRfTkFNRSA9IHByb2Nlc3MuZW52LlMzX0JVQ0tFVF9OQU1FIHx8IFwiXCI7XG4vLyBjb25zdCBTUVNfVVJMID0gcHJvY2Vzcy5lbnYuU1FTX1VSTCB8fCBcIlwiO1xuLy8gY29uc3QgU05TX1RPUElDX0FSTiA9IHByb2Nlc3MuZW52LlNOU19UT1BJQ19BUk4gfHwgXCJcIjtcbi8vIGNvbnN0IFNOU19ST0xFX0FSTiA9IHByb2Nlc3MuZW52LlNOU19ST0xFX0FSTiB8fCBcIlwiO1xuXG5leHBvcnQgY29uc3QgaGFuZGxlciA9IGFzeW5jIChldmVudDogYW55ID0ge30pOiBQcm9taXNlPGFueT4gPT4ge1xuICBjb25zb2xlLmxvZyhcIlFVRVVFIFJFU1VMVFwiKTtcbiAgLy8gY29uc29sZS5sb2coU05TX1RPUElDX0FSTik7XG4gIC8vIGNvbnNvbGUubG9nKFNOU19ST0xFX0FSTik7XG4gIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGV2ZW50LCBudWxsLCA0KSk7XG4gIC8vIHJldHVybjtcblxuICBsZXQgSm9iSWQgPSBcIlwiO1xuICB0cnkge1xuICAgIEpvYklkID0gZXZlbnRbXCJSZWNvcmRzXCJdWzBdW1wiU25zXCJdW1wiTWVzc2FnZVwiXTtcbiAgICBjb25zb2xlLmxvZyhcInBhcnNlZCBqb2JpZCBzdHJ1Y3QgZnJvbSBldmVudFwiKTtcbiAgICBjb25zb2xlLmxvZyhKb2JJZCk7XG4gICAgY29uc29sZS5sb2coSlNPTi5wYXJzZShKb2JJZCkpO1xuICAgIGNvbnN0IGpvYklEU3RydWN0ID0gSlNPTi5wYXJzZShKb2JJZCk7XG4gICAgSm9iSWQgPSBqb2JJRFN0cnVjdFtcIkpvYklkXCJdO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5sb2coXCJFUlJPUiBQQVJTSU5HIEpPQiBJRFwiKTtcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgfVxuXG4gIC8vIExvZyBKb2JJRFxuICBjb25zb2xlLmxvZyhcIkpvYklkXCIpO1xuICBjb25zb2xlLmxvZyhKb2JJZCk7XG5cbiAgdmFyIHBhcmFtczogYW55ID0ge1xuICAgIEpvYklkXG4gICAgLy8gTWF4UmVzdWx0czogMVxuICAgIC8vIE5leHRUb2tlbjogXCJTVFJJTkdfVkFMVUVcIlxuICB9O1xuXG4gIGNvbnNvbGUubG9nKHBhcmFtcyk7XG5cbiAgYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgLy8gdGV4dHJhY3QuZ2V0RG9jdW1lbnRBbmFseXNpcyhwYXJhbXMsIGZ1bmN0aW9uKGVycjogYW55LCBkYXRhOiBhbnkpIHtcbiAgICB0ZXh0cmFjdC5nZXREb2N1bWVudFRleHREZXRlY3Rpb24ocGFyYW1zLCBmdW5jdGlvbihlcnI6IGFueSwgZGF0YTogYW55KSB7XG4gICAgICBjb25zb2xlLmxvZyhcImVyciwgZXJyLnN0YWNrXCIpO1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIC8vIGFuIGVycm9yIG9jY3VycmVkXG4gICAgICBjb25zb2xlLmxvZyhcImRhdGFcIik7IC8vIHN1Y2Nlc3NmdWwgcmVzcG9uc2VcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpOyAvLyBzdWNjZXNzZnVsIHJlc3BvbnNlXG4gICAgICByZXNvbHZlKGRhdGEpO1xuXG4gICAgICAvLyBEZWZpbmVzIHRoZSBpdGVtIHdlJ3JlIGluc2VydGluZyBpbnRvIHRoZSBkYXRhYmFzZVxuICAgICAgY29uc3QgaXRlbTogYW55ID0ge1xuICAgICAgICBbUFJJTUFSWV9LRVldOiBKb2JJZCxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIC4uLmRhdGFcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgLy8gRGVmaW5lcyB0aGUgcGFyYW1zIGZvciBkYi5wdXRcbiAgICAgIGNvbnN0IGR5bmFtb1BhcmFtcyA9IHtcbiAgICAgICAgVGFibGVOYW1lOiBUQUJMRV9OQU1FLFxuICAgICAgICBJdGVtOiBpdGVtXG4gICAgICB9O1xuXG4gICAgICAvLyBJbnNlcnRzIHRoZSByZWNvcmQgaW50byB0aGUgRHluYW1vREIgdGFibGVcbiAgICAgIHJldHVybiBkYi5wdXQoZHluYW1vUGFyYW1zKS5wcm9taXNlKCk7XG4gICAgfSk7XG4gIH0pO1xufTtcbiJdfQ==