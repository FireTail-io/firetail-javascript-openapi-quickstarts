/* eslint-disable */
// @ts-nocheck
import _ from "lodash";
import { Request, Response } from "express";
import data from "./data";

const pets = [
    {
        id: 11,
        name: "cat",
        tags: [
            {
                id: 1,
                name: "authorized tag",
            },
        ],
        ownerId: 1, // <- WRONG OWNER ID
    },
    {
        id: 12,
        name: "dog",
        tags: [
            {
                id: 3,
                name: "not authorized tag",
            },
        ],
        ownerId: 1234567890, // <- CORRECT OWNER ID
    },
];

const getPetById = (req: Request, res: Response) => {
    const id = +req.params.petId;
    const pet = { ..._.find(data.pets, { id }) };

    return res.status(200).json(pet); // <- UNCONTRAINED DATA RETURN
};

const addPet = (req: Request, res: Response) => {
    data.pets = _.unionBy(data.pets, [req.body], "id");

    // const brokenResponse = {
    //     ...req.body,
    //     id: "This should be an int",
    //     foo: "This should not exists",
    // };
    // delete brokenResponse.name;

    return res.status(200).json(req.body);
};

export default {
    getPetById,
};
