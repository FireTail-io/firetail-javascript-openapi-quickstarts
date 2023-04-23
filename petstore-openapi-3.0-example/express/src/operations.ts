/* eslint-disable */
// @ts-nocheck
// /////////////////////////////////////////////////////////////////////////////
//
// Route Handlers
//
// This file contains the route handlers for the pet shop example.
//
// /////////////////////////////////////////////////////////////////////////////
import _ from "lodash";

import { Request, Response } from "express";

import data from "./data";

const addPet = (req: Request, res: Response) => {
    req.body.id = _.maxBy(data.pets, "id").id + 1;
    req.body.ownerId = req.user.userId;
    data.pets = [...data.pets, _.clone(req.body)];
    return res.status(200).json(req.body);
};

const addPetBroken = (req: Request, res: Response) => {
    req.body.id = _.maxBy(data.pets, "id").id + 1;
    req.body.ownerId = req.user.userId;
    data.pets = [...data.pets, _.clone(req.body)];
    const brokenResponse = {
        ...req.body,
        id: "This should be an int",
    };
    delete brokenResponse.name;
    return res.status(200).json(brokenResponse);
};

const getPetById = (req: Request, res: Response) => {
    const id = +req.params.petId;
    if (!_.find(data.pets, { id })) {
        return res.status(404).send("Pet not found");
    }
    return res.status(200).json(_.find(data.pets, { id }));
};

export default {
    addPet,
    getPetById,
    addPetBroken,
};
