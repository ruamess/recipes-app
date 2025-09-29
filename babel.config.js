export default function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src/'],
          alias: {
            app: './src/app',
            components: './src/components',
            domain: './src/domain',
            shared: './src/shared',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  }
}
