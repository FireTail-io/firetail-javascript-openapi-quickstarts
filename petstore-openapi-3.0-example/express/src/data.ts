/* eslint-disable */
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
        ownerId: 1,
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
        ownerId: 1234567890,
    },
];

export default {
    pets,
};
