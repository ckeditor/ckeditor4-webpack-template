/**
 * @license Copyright (c) 2003-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md.
 */

'use strict';

const { resolve: resolvePath } = require( 'path' );
const TerserWebpackPlugin = require( 'terser-webpack-plugin' );
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require( 'copy-webpack-plugin' );
const srcPath = resolvePath( __dirname, 'src' );
const distPath = resolvePath( __dirname, 'dist' );

module.exports = {
	mode: 'production',
	devtool: 'source-map',

	performance: {
		hints: false
	},

	entry: resolvePath( srcPath, 'index.js' ),

	output: {
		path: distPath,
		filename: 'app.js',
		libraryTarget: 'umd'
	},

	optimization: {
		minimizer: [
			new TerserWebpackPlugin( {
				sourceMap: true,
				terserOptions: {
					output: {
						// Preserve license comments.
						comments: /^!/
					}
				}
			} )
		]
	},

	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					compact: false,
					presets: [
						[
							'@babel/preset-env',
							{
								useBuiltIns: 'usage',
								corejs: 3,
								targets: {
									browsers: [
										'last 2 versions',
										'ie 11'
									],
									node: 12
								}
							}
						]
					]
				}
			}
		]
	},

	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin( {
			patterns: [
				{
					from: '{config.js,contents.css,styles.js,adapters/**/*,lang/**/*,plugins/**/*,skins/**/*,vendor/**/*}',
					to: resolvePath( distPath, 'ckeditor4' ),
					context: resolvePath( __dirname, 'node_modules', 'ckeditor4' )
				},

				{
					from: resolvePath( srcPath, 'index.html' ),
					to: distPath
				}
			]
		} )
	]
};
