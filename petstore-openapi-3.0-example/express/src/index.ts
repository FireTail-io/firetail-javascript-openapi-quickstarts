import * as dotenv from "dotenv";

import express, { Application } from "express";
import { initialize } from "express-openapi";

import fs from "fs";
import path from "path";
import yaml from "yaml";
import bodyParser from "body-parser";

import operations from "./operations";

import firetail from "../../../../firetail-js-lib/dist";

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Set up Express via OpenAPI spec
//
// ///////////////////////////////////////////////////////////////////////////////////////

dotenv.config();

// YAML file => apiDoc
const apiDocPath = "../../swagger-petstore-3.0-example.yaml";
const apiDoc = yaml.parse(fs.readFileSync(path.resolve(__dirname, apiDocPath), "utf8"));

// FireTail setup
const firetailContext = {
    apiDocPath: apiDocPath,
    firetailAPIKey: process.env.FIRETAIL_API_KEY,
    firetailAPIHost: process.env.FIRETAIL_API_HOST,
    securityHandlers: {
        // eslint-disable-next-line
        jwt: (request, scopes, securityDefinition) => {
            request.user = {
                name: "Fred Flintstone",
                userId: 1234567890,
            };
            return true;
        },
        // eslint-disable-next-line
        apiKey: (request, scopes, securityDefinition) => true,
    },
    sensitiveHeaders: ["X-Custom-Cookie"],
    accessResolvers: {
        petAccess: (authenticatedPrincipal, authorisedPrincipal) => {
            return authenticatedPrincipal === authorisedPrincipal;
        },
    },
};

// Express app
const app: Application = express();

// DEMO for non spec routing
// eslint-disable-next-line
// @ts-ignore
// app.use(firetail(firetailContext));
// app.delete("/pet", (req, res) => { res.send("WHOOPSIE"); });
// app.get("/unsanctioned", (req, res) => { res.send("WHOOPSIE"); });


initialize({
    app: app,
    apiDoc: {
        ...apiDoc,
        // Inject FT middleware
        // "x-express-openapi-additional-middleware": [firetail(firetailContext)],
        "x-express-openapi-additional-middleware": [firetail(firetailContext)],
        // Disable the overly helpful built-in validators 
        "x-express-openapi-disable-validation-middleware": true,
    },
    operations: operations,
    consumesMiddleware: {
        "text/text": bodyParser.text(),
        "application/json": bodyParser.json(),
    },
});



// ///////////////////////////////////////////////////////////////////////////////////////
//
// Start server
//
// ///////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});