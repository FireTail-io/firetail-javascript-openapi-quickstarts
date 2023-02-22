// ///////////////////////////////////////////////////////////////////////////////////////
//
// Route Handlers
//
// This file contains the route handlers for the pet shop example. 
//
// ///////////////////////////////////////////////////////////////////////////////////////
import _ from "lodash";

import {
    Request, 
    Response, 
} from "express";

import data from "./data";

const addPet = (req: Request, res: Response) => {
    if (!req.body?.name || !req.body?.photoUrls?.length) {
        return res.status(405).send("Invalid Input");
    }
    data.pets = _.unionBy(data.pets, [req.body], "id");

    const borkedResponse = {
        ...req.body,
        // id: "This should be an int",
        foo: "This should not exists",
    };

    // delete borkedResponse.name;

    return res.status(200).json(borkedResponse);
    // return res.status(200).json(req.body);
};

const updatePet = (req: Request, res: Response) => {
    const id = +req.body.id;
    if (!_.isFinite(id)) {
        return res.status(404).send("Invalid ID supplied");
    }
    if (!_.find(data.pets, { id })) {
        return res.status(404).send("Pet not found");
    }
    data.pets[_.findIndex(data.pets, { id })] = req.body;
    return res.status(200).json(req.body);
};

const getPetById = (req: Request, res: Response) => {
    const id = +req.params.petId;
    if (!_.isFinite(id)) {
        return res.status(400).send("Invalid ID supplied");
    }
    if (!_.find(data.pets, { id })) {
        return res.status(404).send("Pet not found");
    }
    return res.status(200).json(_.find(data.pets, { id }));
};

export default {
    addPet, 
    updatePet, 
    getPetById,
};
