const pets = [
    {
        id: 11,
        category: {
            id: 2,
            name: "Cats",
        },
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
    },
    {
        id: 12,
        category: {
            id: 1,
            name: "Dogs",
        },
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
    },
    {
        id: 13,
        category: {
            id: 2,
            name: "Cats",
        },
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
    },
];

export default {
    pets,
};
