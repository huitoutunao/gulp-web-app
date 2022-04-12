module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  env: {
    browser: true,
    node: true,
  },
  extends: 'airbnb-base',
  rules: {
    semi: ['error', 'never'],
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],
  },
}
