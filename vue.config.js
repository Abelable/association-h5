const { merge } = require("webpack-merge");
const tsImportPluginFactory = require("ts-import-plugin");

module.exports = {
  publicPath: "./",
  parallel: false,
  chainWebpack: (config) => {
    config.module
      .rule("ts")
      .use("ts-loader")
      .tap((options) => {
        options = merge(options, {
          happyPackMode: true,
          transpileOnly: true,
          getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: "vant",
                libraryDirectory: "es",
                style: true,
              }),
            ],
          }),
          compilerOptions: {
            module: "es2015",
          },
        });
        return options;
      });
  },
};
