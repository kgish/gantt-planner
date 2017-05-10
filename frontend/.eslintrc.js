module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 6,
        sourceType: 'module'
    },
    extends: 'eslint:recommended',
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        jquery: true
    },
    rules: {
        "no-console": 0
    }
};
