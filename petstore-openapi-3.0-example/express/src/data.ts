const pets = [{
    "id": 1,
    "category": {
        "id": 2,
        "name": "Cats"
        },
    "name": "Cat 1",
    "photoUrls": ["url1","url2"],
    "tags": [
        {
            "id": 0,
            "name": "tag1"
        },
        {
            "id": 1,
            "name": "tag2"
        }
    ],
    "status": "available"
}, {
    "id": 2,
    "category": {
        "id": 2,
        "name": "Cats"
        },
    "name": "Cat 2",
    "photoUrls": ["url1","url2"],
    "tags": [
        {
            "id": 0,
            "name": "tag2"
        },
        {
            "id": 1,
            "name": "tag3"
        }
    ],
    "status": "available"
}, {
    "id": 3,
    "category": {
        "id": 2,
        "name": "Cats"
        },
    "name": "Cat 3",
    "photoUrls": ["url1","url2"],
    "tags": [
        {
            "id": 0,
            "name": "tag3"
        },
        {
            "id": 1,
            "name": "tag4"
        }
    ],
    "status": "pending"
}];

export default {
    pets,
}