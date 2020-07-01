module.exports = {
  root: true,
  extends: '@react-native-community',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  ignorePatterns: ['lib'],
  rules: {
    'semi': 'off',
    'no-unexpected-multiline': 'error',
  }
};
