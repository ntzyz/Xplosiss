module.exports = {
    "env": {
        "es6": true,
        "node": true,
        "mocha": true,
        "browser": true,
    },
    "parserOptions": {
        "parser": "@typescript-eslint/parser",
        "ecmaVersion": 8
    },
    "extends": [
        'plugin:vue/recommended'        
    ],
    "plugins": [
        "standard",
        "promise",
    ],
    "rules": {
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": 0,
        "comma-dangle": 0,
        "prefer-const": 0,
    },
    "globals": {
        "angular": false,
        "module": false,
        "inject": false
    }
};
