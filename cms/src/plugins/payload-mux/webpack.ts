import path from 'path'
import type { Config } from 'payload/config'
import type { Configuration as WebpackConfig } from 'webpack'

export const extendWebpackConfig =
  (config: Config): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
    webpackConfig => {
      const existingWebpackConfig =
        typeof config.admin?.webpack === 'function'
          ? config.admin.webpack(webpackConfig)
          : webpackConfig

      const mockModulePath = path.resolve(__dirname, './mocks/mockFile.js')

      const newWebpack = {
        ...existingWebpackConfig,
        resolve: {
          ...(existingWebpackConfig.resolve || {}),
          alias: {
            ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
            express: mockModulePath,
            [path.resolve(__dirname, './endpoints/webhook.ts')]: mockModulePath,
            [path.resolve(__dirname, './endpoints/upload.ts')]: mockModulePath,
            [path.resolve(__dirname, './hooks/beforeChange.ts')]: mockModulePath,
            [path.resolve(__dirname, './hooks/afterDelete.ts')]: mockModulePath,
          },
        },
      }

      return newWebpack
    }
