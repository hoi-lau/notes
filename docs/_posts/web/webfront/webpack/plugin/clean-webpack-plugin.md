## clean-webpack-plugin ## 

` npm i clean-webpack-plugin -D `

```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const pathToClean = [path.resolve(__dirname, '../dist')]
module.exports = {
	plugins:[
		new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: pathToClean
        })
	]
}
```

## [ 详细配置 ](<https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional>) ##

