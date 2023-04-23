const pets = [
    {
        id: 11,
        name: "cat 1",
        tags: [
            {
                id: 1,
                name: "tag1",
            },
            {
                id: 2,
                name: "tag2",
            },
        ],
        ownerId: 0,
        internalId: "This should not be exposed",
    },
    {
        id: 12,
        name: "dog 1",
        tags: [
            {
                id: 2,
                name: "tag2",
            },
            {
                id: 9,
                name: "tag9",
            },
        ],
        ownerId: 0,
        internalId: "This should not be exposed",
    },
    {
        id: 13,
        name: "cat 2",
        tags: [
            {
                id: 3,
                name: "tag3",
            },
            {
                id: 4,
                name: "tag4",
            },
        ],
        ownerId: 1234567890,
        internalId: "This should not be exposed",
    },
];

export default {
    pets,
};
