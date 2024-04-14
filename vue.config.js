const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    externals: {
      sqlite3: 'commonjs sqlite3',
    },
    resolve: {
      fallback: {
        "fs": require.resolve("fs-extra"),
        "path": require.resolve("path-browserify"),
        "stream": require.resolve("stream-browserify"),
        "constants": require.resolve("constants-browserify"),
        "process": require.resolve("process/browser")
      }
    }
  },  
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    }
  }
})
