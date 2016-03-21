
var GLOBAL_CONFIG   = require('../config/config-global');

var host 	= 'http://' + GLOBAL_CONFIG.WCHAT_SERVER_HOSTNAME;

module.exports = {
	gen_paysign: host + '/gen-paysign/{{{prepayid}}}'
}