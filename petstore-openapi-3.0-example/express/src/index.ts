import express, { Application } from "express";
import { initialize } from "express-openapi";

import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

import operations from "./operations";


// ///////////////////////////////////////////////////////////////////////////////////////
//
// Set up Express via OpenAPI spec
//
// ///////////////////////////////////////////////////////////////////////////////////////

// YAML file => apiDoc
import yaml from "yaml";

const filePath = "../../swagger-petstore-3.0-example.yaml";
const apiDoc = yaml.parse(fs.readFileSync(path.resolve(__dirname, filePath), 'utf8'));

// FireTail setup
// import firetail from "./firetail-middleware";
import firetail from "@public.firetail.io/firetail-api";

const firetailOpts = {
    firetailAPIHost: "api.logging.eu-west-1.sandbox.firetail.app",
    firetailAPIKey: "PS-02-50ce286d-1801-43d2-8f98-542a19f12b06-b4e378cf-109d-43f5-be79-5b98543b3d0f",
    addApi: "../../swagger-petstore-3.0-example.yaml",
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
    }
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