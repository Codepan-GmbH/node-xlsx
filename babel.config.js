module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: '4',
        },
      },
    ],
  ],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
};
