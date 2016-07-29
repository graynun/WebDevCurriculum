var express = require('express'),
	path = require('path'),
	app = express(),
	bodyParser = require('body-parser');

app.use(express.static('client'));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8080, function () {
	console.log('Server started!');
});

app.post('/savefile', function(req, res){
	console.log("savefile had called");
	console.log(req.body);

	// res.end();
});
