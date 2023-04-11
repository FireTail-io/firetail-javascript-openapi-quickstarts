const pets = [
    {
        id: 11,
        category: {
            id: 2,
            name: "Cats",
        },
        name: "Cat 1",
        photoUrls: ["url1", "url2"],
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
        status: "available",
        ownerId: 1,
    },
    {
        id: 12,
        category: {
            id: 2,
            name: "Cats",
        },
        name: "Cat 2",
        photoUrls: ["url1", "url2"],
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
        status: "available",
        ownerId: 2,
    },
    {
        id: 13,
        category: {
            id: 2,
            name: "Cats",
        },
        name: "Cat 3",
        photoUrls: ["url1", "url2"],
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
        status: "pending",
        ownerId: 1234567890,
    },
];

export default {
    pets,
};
