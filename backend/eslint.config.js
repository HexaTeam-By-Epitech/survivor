module.exports = [
    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "commonjs",
            globals: {
                process: "readonly",
                Buffer: "readonly",
                console: "readonly",
                __dirname: "readonly",
                __filename: "readonly",
                module: "readonly",
                require: "readonly",
                exports: "readonly",
                global: "readonly",
                setTimeout: "readonly",
                clearTimeout: "readonly",
                setInterval: "readonly",
                clearInterval: "readonly"
            }
        },
        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "semi": ["error", "always"],
            "no-trailing-spaces": "error",
            "eol-last": "error"
        }
    },
    {
        files: ["tests/**/*.js"],
        languageOptions: {
            globals: {
                jest: "readonly",
                describe: "readonly",
                test: "readonly",
                it: "readonly",
                expect: "readonly",
                beforeAll: "readonly",
                afterAll: "readonly",
                beforeEach: "readonly",
                afterEach: "readonly"
            }
        }
    }
];
