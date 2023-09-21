/* eslint-disable */
// @ts-nocheck
import _ from "lodash";
import { Request, Response } from "express";
import data from "./data";

const getPetById = (req: Request, res: Response) => {
    /**
     * Find the pet with requested id
     **/
    const id = +req.params.petId;
    const pet = { ..._.find(data.pets, { id }) };

    /**
     * Unconstrained data return
     **/
    return res.status(200).json(pet);
};

export default {
    getPetById,
};
