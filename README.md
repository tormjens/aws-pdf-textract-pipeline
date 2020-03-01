# aws-pdf-textract-pipeline

:mag: Data pipeline for crawling PDFs from the Web and transforming their contents into structured data using [AWS Textract](https://aws.amazon.com/textract/). Built with AWS CDK + TypeScript

![Example Extension Popup](https://i.imgur.com/3F89JQK.png "Example Extension Popup")

<!-- https://cloudcraft.co/view/e135397e-a673-411e-9ee7-05a5618052b2?key=R-OLiwplnkA9dtQxtkVqOw&interactive=true&embed=true -->

**Getting Started**

Run the following commands to install dependencies, build the CDK stack, and deploy the CDK Stack to AWS.

```
yarn install
yarn build
cdk bootstrap
cdk deploy
```

**Overview**
![Example Extension Popup](https://i.imgur.com/HkTtLmi.png "Example Extension Popup")
![Example Extension Popup](https://i.imgur.com/bmFJGDW.png "Example Extension Popup")

**Scripts**

- `yarn install` - installs dependencies
- `yarn build` - builds the production-ready CDK Stack
- `yarn test` - runs Jest
- `cdk bootstrap` - bootstraps AWS Cloudformation for your CDK deploy
- `cdk deploy` - deploys the CDK stack to AWS

**Notes**

- Includes tests with Jest.

- Recommended to use `Visual Studio Code` with the `Format on Save` setting turned on.

**Built with**

- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io)
- [Puppeteer](https://jestjs.io)
- [AWS CDK](https://aws.amazon.com/cdk/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [AWS SNS](https://aws.amazon.com/sns/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS S3](https://aws.amazon.com/s3/)

**Additional Resources**

- CDK Documentation
- Puppeteer Documentation
- Puppeteer Lambda
- CDK TypeScript Reference
- CDK Assertion Package
- Textract Pricing Chart
- CDK Resources
- [awesome-cdk repo](https://github.com/eladb/awesome-cdk)
