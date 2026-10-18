const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.platforms = ['web', 'native', 'ios', 'android'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];
config.resolver.alias = {
  ...config.resolver.alias,
  'lucide-react-native': 'lucide-react',
};

config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
  getTransformOptions: async ({ platform }) => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: platform !== 'web',
      ...(platform === 'web' ? { hermesParser: false, enableHermes: false } : {}),
    },
  }),
};

module.exports = config;