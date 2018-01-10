module.exports = {
  "extends": 'standard',
  "rules": {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'one-var': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'brace-style': [2, 'stroustrup', {
      'allowSingleLine': true
    }],
    "space-before-function-paren": ["error", "never"]
  }
}