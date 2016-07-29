var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser'),
	fs = require('fs'),
	app = express();

app.use(express.static('client'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname, 'index.html'));
});

/* TODO: 여기에 처리해야 할 요청의 주소별로 동작을 채워넣어 보세요..! */

var server = app.listen(8080, function () {
	console.log('Server started!');
});

app.post('/savefile', function(req, res){
	console.log("savefile had called");
	// console.log(req.headers);
	console.log(req.body);

	fs.writeFile('./notepad_files/'+req.body.title+'.txt', req.body.content,
		function(err){
			if(err) throw err;
			console.log("file "+req.body.title+"created!");
		}
	);
});

app.get('/reloadFileList', function(req, res){
	console.log("got reloadFileList");
	fs.readdir('./notepad_files/', function(err, files){
		if(err) throw err;
		console.log(files);
		res.send(files);
		res.end();
	});
});