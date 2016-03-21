var http 			= require('http');
var express 		= require('express');
var path 			= require('path');
var URL 			= require('url');
var logger 			= require('morgan');
var cookieParser 	= require('cookie-parser');
var bodyParser 		= require('body-parser');
var ejs 			= require('ejs');
var expressLayouts 	= require("express-ejs-layouts");
//var session 		= require('express-session');



var httpClient 		= require('./commons/http-client').httpClient;
var _CONFIG			= require('./config/config-global');
var _ENDPOINTS 		= require('./commons/endpoints');
var _ENDPOINTS_WX	= require('./commons/endpoints-wx');

console.log(_CONFIG, '_CONFIG');

var app = express();

app.engine('.html', ejs.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.set('port', _CONFIG.PORT);


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressLayouts);
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'www')));

app.get('/', function(req, res) {
	// res.type('text/plain');
	// res.send('heeee');

	res.render('index');
});

app.get('/pay/:orderid', function(req, res, next) {
	//http://localhost:9100/pay/8555074241827141919-bearer-3d4694c2-8a51-4aa9-a4a9-dd956e5b0b8b
	var userToken 		= null;
	var tokenType 		= null;
	var orderid 		= req.params.orderid;

	if (orderid.indexOf('-bearer-') == -1) {
		return next('');
	}

	userToken 		= orderid.split('-bearer-')[1];
	orderid 		= orderid.split('-bearer-')[0];
	tokenType 		= 'bearer';

    var endpoints_order_detail 	= URL.parse(_ENDPOINTS.order_detail.replace("{{{orderid}}}", orderid));

	httpClient(endpoints_order_detail, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

		if (error) {
    		return next(error);
    	}

    	if (result.error) {
	    	return next(result);
    	}

    	var prepayid 	= result.data.order.prePayId;

	    var endpoints_gen_paysign 	= _ENDPOINTS_WX.gen_paysign.replace("{{{prepayid}}}", prepayid);
	    
		var order 		= result.data.order;


	    httpClient(endpoints_gen_paysign, null, 'get', {type: tokenType, token: userToken}, function(error, result) {

			if (error) {
	    		return next(error);
	    	}

	    	if (result.error) {
		    	return next(result);
	    	}

			var paySignObj 	= result.data;

			console.log(order, 'order');
			console.log(paySignObj, 'paySignObj');

    		res.render('pay', { order: order, paySign: paySignObj });

		});	

	});
	
});




app.use(function(req, res) {
	res.status(404);
	res.type('text/plain');
	res.send('404 - page not found!');
});

app.use(function(err, req, res, next) {
  	res.status(500);
  	console.log(err, '500 err');
	res.type('text/plain');
	res.send('Server interal error!');
});


http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});