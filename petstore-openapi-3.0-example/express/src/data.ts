/* eslint-disable */
const pets = [
    {
        id: 11,
        name: "dog",
        tags: [
            {
                id: 400,
                name: "not authorized tag",
            },
        ],
        ownerId: 1, // <- CORRECT OWNER ID
    },
    {
        id: 12,
        name: "cat",
        tags: [
            {
                id: 200,
                name: "authorized tag",
            },
        ],
        ownerId: 1234567890, // <- WRONG OWNER ID
    },
];

export default {
    pets,
};
