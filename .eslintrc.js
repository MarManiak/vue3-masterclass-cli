module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: ['plugin:vue/vue3-essential', 'plugin:prettier/recommended'],

  parserOptions: {
    parser: '@babel/eslint-parser',
  },

  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/no-deprecated-router-link-tag-prop': 'off',
    'no-unused-vars': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  },
};
