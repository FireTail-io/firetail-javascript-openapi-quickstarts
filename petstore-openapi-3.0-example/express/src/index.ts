/* eslint-disable */
import express, { Application } from "express";
import { initialize } from "express-openapi";

import fs from "fs";
import path from "path";
import yaml from "yaml";
import bodyParser from "body-parser";

import map from "lodash/map";
import some from "lodash/some";
import find from "lodash/find";

import auth from "./auth";

import operations from "./operations";

import firetail from "../../../../firetail-js-lib-enterprise/dist";

import * as dotenv from "dotenv";
dotenv.config();
// /////////////////////////////////////////////////////////////////////////////
//
// Set up Express via OpenAPI spec
//
// /////////////////////////////////////////////////////////////////////////////

// YAML file => apiDoc
const apiDocPath = path.resolve(
    __dirname,
    "../../swagger-petstore-3.0-example.yaml"
);
const apiDoc = yaml.parse(fs.readFileSync(apiDocPath, "utf8"));

// FireTail setup
const firetailContext = {
    apiDocPath: apiDocPath,
    firetailAPIKey: process.env.FIRETAIL_API_KEY,
    firetailAPIHost: process.env.FIRETAIL_API_HOST,

    /**
     * Define sensitive headers
     **/
    sensitiveHeaders: ["X-Custom-Cookie"],

    /**
     * Define handlers for the OpenAPI security schemas
     **/
    securityHandlers: {
        jwt: (request, scopes, securityDefinition) => {
            const auth = request.headers.authorization;
            if (auth !== "Bearer 12345678-abcd-abcd-abcd-1234567890ab") {
                return false;
            }
            request.user = {
                name: "Fred Flintstone",
                userId: 1234567890,
            };
            return true;
        },
    },

    /**
     * Define resolvers for authorization checks
     **/
    accessResolvers: {
        /**
         * A simple resolver can check that the owner (authorized principal)
         * of the resource is the same as the logged in user (authenticated
         * principal)
         **/
        petAccess: (authNPrincipal, authZPrincipal, authZResource) => {
            return authNPrincipal === authZPrincipal;
        },

        /**
         * A resolver can perform async authorization checks against more
         * complicated authorization models (RBAC, ABAC). In this case an
         * OpenFGA authorization model which grants access based on pet's
         * tags.
         **/
        petAccessByTag: async (
            authNPrincipal,
            authZPrincipal,
            authZResource
        ) => {
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
            return some(checks, "allowed");
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

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Start server
//
// ///////////////////////////////////////////////////////////////////////////////////////

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});
