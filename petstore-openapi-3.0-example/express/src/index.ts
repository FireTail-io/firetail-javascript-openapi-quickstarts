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

// YAML file => apiDoc
const apiDocPath = "../../swagger-petstore-3.0-example.yaml";
const apiDoc = yaml.parse(fs.readFileSync(path.resolve(__dirname, apiDocPath), "utf8"));

// FireTail setup
const firetailContext = {
    apiDocPath: apiDocPath,
    firetailAPIKey: "PS-02-50ce286d-1801-43d2-8f98-542a19f12b06-b4e378cf-109d-43f5-be79-5b98543b3d0f",
    firetailAPIHost: "api.logging.eu-west-1.sandbox.firetail.app",
    securityHandlers: {
        jwt: (request, scopes, securityDefinition) => {
            console.log("Handling security for: ", request.path, scopes, securityDefinition);
            request.user = {
                name: "Fred",
                userId: 1234567890,
            };
            return true;
        },
    },
};

// Express app
const app: Application = express();

initialize({
    app: app,
    apiDoc: {
        ...apiDoc,
        // Inject FT middleware
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

// DEMO for non spec routing
// @ts-ignore
// app.use(firetail(firetailContext));
// app.get("/*", (req, res) => res.send({foo: "GOTCHA"}));
// app.delete("/pet/:id?", (req, res) => { res.send("WHOOPSIE"); });
// app.get("/unsanctioned", (req, res) => { res.send("WHOOPSIE"); });


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Start server
//
// ///////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});