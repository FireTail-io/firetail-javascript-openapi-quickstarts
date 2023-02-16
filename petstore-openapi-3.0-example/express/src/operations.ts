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
    NextFunction,
} from "express";

import data from "./data";

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

export default {
    addPet, 
    updatePet, 
    getPetById,
}