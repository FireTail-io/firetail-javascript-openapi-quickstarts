import * as dotenv from "dotenv";

import express, { Application } from "express";
import { initialize } from "express-openapi";

import fs from "fs";
import path from "path";
import yaml from "yaml";
import bodyParser from "body-parser";

import map from "lodash/map";
import some from "lodash/some";

import { OpenFgaApi } from "@openfga/sdk";

import operations from "./operations";

import firetail from "../../../../firetail-js-lib/dist";

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Set up Express via OpenAPI spec
//
// ///////////////////////////////////////////////////////////////////////////////////////

dotenv.config();

// OpenFGA init
const fgaClient = new OpenFgaApi({
    apiScheme: "http",
    apiHost: "localhost:8080",
    storeId: "01GTE2PNCT9TDEWCAXP7BVSK79",
});

// YAML file => apiDoc
const apiDocPath = "../../swagger-petstore-3.0-example.yaml";
const apiDoc = yaml.parse(
    fs.readFileSync(path.resolve(__dirname, apiDocPath), "utf8")
);

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
        petAccess: (authNPrincipal, authZPrincipal) => {
            return authNPrincipal === authZPrincipal;
        },
        petAccessByTag: async (authNPrincipal, authZResource) => {
            // authZResource contains a "tags" array and we can check each tag
            // for authZ via OpenFGA
            const checks = await Promise.all(map(authZResource.tags, async t => {
                return await fgaClient.check({
                    authorization_model_id: "01GTE2QYARWF43D8392DY4G3TR",
                    tuple_key: {
                        user: `user:${authNPrincipal}`,
                        relation: "reader",
                        object: `tag:${t.id}`,
                    },
                });
            }));
            // checks is of the form [{allowed: <bool>, ...}, ...]
            return some(checks, "allowed");
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
