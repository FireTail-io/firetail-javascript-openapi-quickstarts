const pets = [
    {
        id: 11,
        name: "cat",
        tags: [
            {
                id: 1,
                name: "tag1",
            },
        ],
        ownerId: 1, // <- Not authorized
    },
    {
        id: 12,
        name: "dog",
        tags: [
            {
                id: 2,
                name: "tag2",
            },
        ],
        ownerId: 1234567890, // <- Authorized
    },
];

export default {
    pets,
};
