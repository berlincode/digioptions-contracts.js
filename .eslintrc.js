module.exports = {
    "globals": {
        "define": true
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "node": true
    },
    "extends": "eslint:recommended",
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
        "semi": [
            "error",
            "always"
        ],
        "no-warning-comments": [
            1,
            {
                "terms": ["todo", "fixme"], 
                "location": "anywhere"
            }
        ],
        "object-curly-spacing": [
            "error",
            "never"
        ]
    }
};
