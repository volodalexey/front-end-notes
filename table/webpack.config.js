const
  NODE_ENV = process.env.NODE_ENV,
  json_package = require('./package.json'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin'),
  path = require('path'),
  join = path.join,
  resolve = path.resolve;

const
  isDev = NODE_ENV === 'development',
  root = resolve(__dirname),
  src = join(root, 'src'),
  modules = join(root, 'node_modules'),
  dist = join(root, 'build');

let options = {
  splitJS: true, // split output js bundle into *.app.js and *.vendor.js
  inlineCSS: isDev, // inline styles into js => will be added as <style> into header
  splitCSS: true, // split output css bundle into *.app.css and *.vendor.css
  minimize: !isDev // minimize js and css
};

const
  indexFileName = 'index.html',
  jsAppFilename = `bundle.[name]${isDev ? '' : '.[chunkhash]'}.js`,
  cssAppFilename = `bundle.app${isDev ? '' : '.[contenthash]'}.css`,
  cssVendorFilename = `bundle.vendor${isDev ? '' : '.[contenthash]'}.css`,
  otherFileName = `${isDev ? '[name]' : '[hash]'}.[ext]`;

let
  extractAppCSS = new ExtractTextPlugin(cssAppFilename),
  extractVendorCSS = new ExtractTextPlugin(cssVendorFilename);

if (!options.splitCSS) {
  extractVendorCSS = extractAppCSS;
}

const
  modulesCssLoader = {
    loader: 'css-loader',
    options: {
      minimize: options.minimize,
      modules: true,
      localIdentName: isDev ? '[path][name]__[local]__[hash:base64:5]' : '[hash:base64:5]'
    }
  },
  postCssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: () => {
        return [
          require('postcss-import')({}),
          require('precss')({
            'import': {'disable': true} // https://github.com/jonathantneal/postcss-partial-import/issues/41
          }),
          require('autoprefixer')({})
        ]
      }
    }
  },
  vendorCssLoader = {
    loader: 'css-loader',
    options: {
      minimize: options.minimize
    }
  };

let config = {

  entry: {
    app: join(src, 'SimpleApp/app.js')
  },

  output: {
    path: dist,
    filename: jsAppFilename,
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [src],
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        include: [src],
        exclude: [modules],
        use:
          options.inlineCSS ?
            [ { loader: 'style-loader' }, modulesCssLoader, postCssLoader] :
            extractAppCSS.extract({
              fallback: 'style-loader',
              use: [ modulesCssLoader, postCssLoader ]
            })
      },
      {
        test: /\.css$/,
        include: [modules],
        exclude: [src],
        use:
          options.inlineCSS ?
            [ { loader: 'style-loader' }, vendorCssLoader] :
            extractVendorCSS.extract({fallback: 'style-loader', use: vendorCssLoader})
      }
    ]
  },

  resolve: {
    extensions: ['.js', '.jsx']
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: indexFileName,
      template: join(src, 'SimpleApp/index.ejs'),
      inject: 'head'
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    }),
  ]
};

if (options.splitJS) {
  let vendor = Object.keys(json_package.dependencies);
  if (json_package._vendor) {
    vendor = vendor.reduce((arr, key) => {
      if (Array.isArray(json_package._vendor[key])) {
        Array.prototype.push.apply(arr, json_package._vendor[key]);
      } else {
        arr.push(key);
      }
      return arr;
    }, []);
  }
  config.entry.vendor = vendor;

  config.plugins.push(new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' }));
}
if (!options.inlineCSS) {
  if (options.splitCSS) {
    config.plugins.push(extractVendorCSS);
  }
  config.plugins.push(extractAppCSS);
}

config.plugins.push(new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(options.minimize ? NODE_ENV : 'development')
}));

if (options.minimize) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: { warnings: false },
    // mangle: {
    //   except: []
    // }
  }));
}

if (isDev) {
  config.devServer = {
    historyApiFallback: true,
    publicPath: "/",
  };
}

module.exports = config;