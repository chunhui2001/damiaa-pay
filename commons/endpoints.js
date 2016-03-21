
var GLOBAL_CONFIG   = require('../config/config-global');

var host 	= 'http://' + GLOBAL_CONFIG.DAMIAA_API_HOSTNAME;

module.exports = {
	order_detail: host + '/order/{{{orderid}}}'
}