const express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

let idtoken;

app.use(express.static(__dirname));
// app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.listen(8080, (err)=>{
	if(err) throw err;
	console.log("sever started at 8080");
});

app.get('/', (req, res)=> {
	 res.sendFile(__dirname+'/login.html');
})

app.get('/main', (req, res)=>{
	res.sendFile(__dirname+'/main.html');
});


app.post('/validateToken', (req, res)=>{
	console.log(req.body);
	idtoken = req.body.idtoken;
	res.redirect('/main');
})