module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        // root: ['./src'],
        alias: {
          '@env': '.env',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanFaces'],
      },
    ],
    'react-native-worklets-core/plugin',
    'inline-dotenv',
  ],
};
