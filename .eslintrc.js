const rules = require("../../common-eslint-rules");

module.exports = {
    "root": true,
    "rules": rules,
    "env": {
        "browser": true
    },
    "extends": [
        "eslint:recommended"
    ],
    "parserOptions": {
        "parser": "babel-eslint"
    },
    "globals": {
        "process": true,
        "_": true,
        "require": true,
        "module": true
    }
};