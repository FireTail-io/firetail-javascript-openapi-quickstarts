import _ from "lodash";

import express, {
    Application,
    Request, 
    Response, 
    NextFunction,
} from "express";
import { initialize } from "express-openapi";

import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

import data from "./data";

// ///////////////////////////////////////////////////////////////////////////////////////
//
// Handlers
//
// ///////////////////////////////////////////////////////////////////////////////////////

const addPet = (req: Request, res: Response, next: NextFunction) => {
    if (!req.body?.name || !req.body?.photoUrls?.length) {
        return res.status(405).send("Invalid Input");
    }
    data.pets = _.unionBy(data.pets, [req.body], "id");
    res.status(200).json(req.body);
};

const updatePet = (req: Request, res: Response, next: NextFunction) => {
    const id = +req.body.id;
    if (!_.isFinite(id)) {
        return res.status(404).send("Invalid ID supplied");
    }
    if (!_.find(data.pets, { id })) {
        return res.status(404).send("Pet not found");
    }
    data.pets[_.findIndex(data.pets, { id })] = req.body;
    res.status(200).json(req.body);
};

const getPetById = (req: Request, res: Response, next: NextFunction) => {
    const id = +req.params.petId;
    if (!_.isFinite(id)) {
        return res.status(400).send("Invalid ID supplied");
    }
    if (!_.find(data.pets, { id })) {
        return res.status(404).send("Pet not found");
    }
    res.status(200).json(_.find(data.pets, { id }));
};

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
import firetail from "./firetail-middleware";

const firetailOpts = {
    apiUrl: "api.logging.eu-west-1.sandbox.firetail.app",
    apiKey: "PS-02-50ce286d-1801-43d2-8f98-542a19f12b06-b4e378cf-109d-43f5-be79-5b98543b3d0f",
    addApi: "../../swagger-petstore-3.0-example.yaml",
};

// Express app
const app: Application = express();

initialize({
    app: app,
    apiDoc: {
        ...apiDoc,
        // Inject FT middleware
        "x-express-openapi-additional-middleware": [firetail(firetailOpts)],
        // Disable the overly helpful build-in validators 
        "x-express-openapi-disable-validation-middleware": true,
    },
    operations: {
        addPet, 
        updatePet,
        getPetById,
    },
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