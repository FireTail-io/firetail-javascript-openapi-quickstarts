/* eslint-disable */
// @ts-nocheck
import _ from "lodash";
import { Request, Response } from "express";
import data from "./data";

const getPetById = (req: Request, res: Response) => {
    const id = +req.params.petId;
    const pet = { ..._.find(data.pets, { id }) };

    return res.status(200).json(pet); // <- UNCONTRAINED DATA RETURN
};

const addPet = (req: Request, res: Response) => {
    data.pets = _.unionBy(data.pets, [req.body], "id");

    const response = {
        ...pet,
        // id: "This should be an int",
        // foo: "This should not exists",
    };
    // delete response.name;

    return res.status(200).json(response);
};

export default {
    getPetById,
    addPet,
};
