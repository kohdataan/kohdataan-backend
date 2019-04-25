module.exports = {
  env: {
    jest: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'es5',
      },
    ],
    semi: ['error', 'never'],
    'no-plusplus': [2, { allowForLoopAfterthoughts: true }],
  },
  parser: 'babel-eslint',
}
