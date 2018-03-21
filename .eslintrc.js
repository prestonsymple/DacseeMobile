module.exports = {
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "jsx": true
        },
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "flow-vars"
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "no-console": [
            "error", 
            { 
                "allow": [
                    "warn", 
                    "error",
                    "log"
                ] 
            }
        ],
        // "semi": [
        //     "error",
        //     "never"
        // ],
        "no-unused-vars": 1,
        "react/prop-types": 0,
        "flow-vars/define-flow-type": 1,
        "flow-vars/use-flow-type": 1
    }
};