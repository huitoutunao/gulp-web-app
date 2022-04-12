module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-recess-order'],
  plugins: ['stylelint-scss'],
  rules: {
    'max-nesting-depth': 20,
    'selector-max-id': 2,
    'color-hex-case': 'lower',
    'color-hex-length': 'short'
  },
}
