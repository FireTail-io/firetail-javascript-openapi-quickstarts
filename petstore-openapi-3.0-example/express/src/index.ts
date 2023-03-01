import express, { Application } from "express";
import { initialize } from "express-openapi";

import fs from "fs";
import path from "path";
import yaml from "yaml";
import bodyParser from "body-parser";

import map from "lodash/map";
import some from "lodash/some";

import auth from "./auth";

import operations from "./operations";

import firetail from "../../../../firetail-js-lib/dist";

import * as dotenv from "dotenv";
dotenv.config();

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Set up Express via OpenAPI spec
//
// ///////////////////////////////////////////////////////////////////////////////////////

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
    sensitiveHeaders: ["X-Custom-Cookie"],
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
    identityResolvers: {},
    accessResolvers: {
        // eslint-disable-next-line
        petAccess: (authNPrincipal, authZPrincipal, authZResource) => {
            return authNPrincipal === authZPrincipal;
        },
        petAccessByTag: async (
            authNPrincipal,
            authZPrincipal,
            authZResource
        ) => {
            // authZResource contains a "tags" array and we can check each tag
            // for authZ via OpenFGA
            const checks = await Promise.all(
                map(authZResource.tags, async t => {
                    return await auth.fgaClient.check({
                        authorization_model_id: auth.authorization_model_id,
                        tuple_key: {
                            user: `user:${authNPrincipal}`,
                            relation: "reader",
                            object: `tag:${t.id}`,
                        },
                    });
                })
            );
            // checks is of the form [{allowed: <boolean>, ...}, ...]
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
