# Serverless Framework - quickstart

This template demonstrates how to make a simple HTTP API with [Firetail](https://www.npmjs.com/package/@public.firetail.io/firetail-api) running on AWS Lambda and API Gateway using the Serverless Framework.

This template does not include any kind of persistence (database). For more advanced examples, check out the [serverless/examples repository](https://github.com/serverless/examples/) which includes Typescript, Mongo, DynamoDB and other examples.

**For a complete kitchen sink style example. See: [Petstore Express.js Example](https://github.com/FireTail-io/firetail-js-lib/tree/main/sample/express)**

## To get started

### a HelloWorld example

Place your API YAML inside the root path of your application. Then run:

```js
// ========== Lets import what we are going to need
const firetailSetup = require("@public.firetail.io/firetail-api");

// ========== firetail options
const firetailOpts = { addApi: "./swagger.yaml" }
// IF you run locally via 'serverless offline'
// firetailOpts.lamdba = true // Add the lamdba flag

// ========== install the firetail middleware
const firetailWrapper = firetailSetup(firetailOpts)

// ========== Add the end-point you want
//...
module.exports.app = firetailWrapper((event,context) => {
  return {
    statusCode:200,
    body: "FireTail sample"
  };
})
//... They should match whats in your YAML
```

### To use this sample:
Open the quickstart
```cli
cd javascript-quickstarts/lamdba
```
Now we can install the samples dependencies
```cli
npm install
```
Now you can start the server
```cli
serverless offline
```

## Try it out
Now that the server is started. Open a browser and go to **http://localhost:3000**

## structure
```
lamdba/
├─ animals.json      ← Sample data to be use
├─ petstore.yaml     ← The open API specification that this service will a here too
├─ serverless.yml    ← Entry point and wiring for the service
└─ handler.js        ← Function and wiring for the service
```

### We can try some different types of requests
* *it's recommended when testing an API to use a tool such as [postman](https://www.postman.com/)*

#### Use Lamdba's native routing mechanism | **[GET: /pets](http://localhost:3000/pets)**
This endpoint list all pets. You can find the implementation at [handler.js ~ module.exports.pets](/lambda/handler.js#L9). It is load on [serverless.yml.js ~ functions:pets:handler](/lambda/serverless.yml#L13)

The important thing to note is that the service's handler is passed to `firetailWrapper` before being exported. This is what allow Firetail to intercept the request and and apply the API protection.


#### Passing query arguments | **[GET: /pets?limit=2](http://localhost:3000/pets?limit=2)**
 The same as above while utilising queryStringParameters

---

```js
fetch('http://localhost:3000/dev/pets', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  },
  body: JSON.stringify({ "name": "Mr Beast", "tag": "dog" })
})
.then((response) => response.text())
.then((data) => console.log('Success:', data))
.catch((error) => console.error('Error:', error));
```

---

## To deployment this example
```
$ serverless deploy
```

After deploying, you should see output similar to:

```bash
Deploying aws-node-http-api-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-http-api-project-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/
functions:
  hello: aws-node-http-api-project-dev-hello (1.9 kB)
```

_Note_: In current form, after deployment, your API is public and can be invoked by anyone. For production deployments, you might want to configure an authorizer. For details on how to do that, refer to [http event docs](https://www.serverless.com/framework/docs/providers/aws/events/apigateway/).

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/
```

Which should result in response similar to the following (removed `input` content for brevity):

```json
{
  "message": "Go Serverless v2.0! Your function executed successfully!",
  "input": {
    ...
  }
}
```
