import { OpenFgaApi } from "@openfga/sdk";

const apiScheme = "http";
const apiHost = "localhost:8080";
const openFga = new OpenFgaApi({ apiScheme, apiHost });

export const options = {
    storeId: null,
    fgaClient: null,
    authorization_model_id: null,
};

openFga
    .createStore({
        name: "Pet Store Auth",
    })
    .then(store => {
        options.storeId = store.id;
        options.fgaClient = new OpenFgaApi({
            apiHost: apiHost,
            apiScheme: apiScheme,
            storeId: options.storeId,
        });
        options.fgaClient
            .writeAuthorizationModel({
                schema_version: "1.1",
                type_definitions: [
                    {
                        type: "user",
                    },
                    {
                        type: "tag",
                        relations: {
                            reader: {
                                this: {},
                            },
                            writer: {
                                this: {},
                            },
                            owner: {
                                this: {},
                            },
                        },
                        metadata: {
                            relations: {
                                reader: {
                                    directly_related_user_types: [
                                        {
                                            type: "user",
                                        },
                                    ],
                                },
                                writer: {
                                    directly_related_user_types: [
                                        {
                                            type: "user",
                                        },
                                    ],
                                },
                                owner: {
                                    directly_related_user_types: [
                                        {
                                            type: "user",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                ],
            })
            .then(result => {
                options.authorization_model_id = result.authorization_model_id;

                options.fgaClient.write({
                    writes: {
                        tuple_keys: [
                            {
                                user: "user:1234567890",
                                relation: "reader",
                                object: "tag:1",
                            },
                            {
                                user: "user:1234567890",
                                relation: "reader",
                                object: "tag:2",
                            },
                        ],
                    },
                    authorization_model_id: options.authorization_model_id,
                });
            });
    });

export default options;
