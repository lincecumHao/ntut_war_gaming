module.exports = {
	entry: "public/javascripts/src/index.jsx",
	output:{
		filename: 'bundle.js',
		publicPath: 'http://localhost:8090/assets'
	},
	module:{
		loaders:[
			{
				test:'/\.jsx/',
				loader:'jsx-loader'
			}
		]
	},
	externals: {
		'react': 'React'
	},
	resolve:{
		extensions: ['', 'js', 'jsx']
	}
}