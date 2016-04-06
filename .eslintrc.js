module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaFeatures: {
            experimentalObjectRestSpread: true,
            jsx: true,
        },
        sourceType: 'module',
    },
	globals: {
		describe: true,
		before: true,
		after: true,
		beforeEach: true,
		afterEach: true,
		it: true,
	},
    rules: {
        indent: [2, 'tab'],
        'linebreak-style': [2, 'unix'],
        quotes: [2, 'single'],
        semi: [2, 'always'],
        'comma-dangle': [2, 'always-multiline'],
    },
};
