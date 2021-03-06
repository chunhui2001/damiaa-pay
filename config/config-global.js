var _ 				= require('underscore');

var devConfig 		= require('./config-dev');
var localConfig 	= require('./config-local');
var prodConfig 		= require('./config-prod');
var stagingConfig 	= require('./config-staging');


var externalConfig 	= null;

switch(process.env.NODE_ENV) {
	case "development":
		externalConfig = devConfig;
		break;
	case "local":
		externalConfig = localConfig;
		break;
	case "production":
		externalConfig = prodConfig;
		break;
	case "staging":
		externalConfig = stagingConfig;
		break;
	default:
		externalConfig = devConfig;
}


var globalConfig 	= {
	PORT: '9100',
	DAMIAA_API_HOSTNAME: 'api-staging.damiaa.com',
	WCHAT_SERVER_HOSTNAME: 'wchat.damiaa.com',
	ENVIRONMENT: 'development'
};


module.exports = _.extend(globalConfig, externalConfig);