const express = require('express'),
	bodyParser = require('body-parser'),
	app = express();

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({
	extended:true
}));

app.listen(8080, (err)=>{
	if(err) throw err;
	console.log("sever started at 8080");
});

app.get('/', (req, res)=> {
	 res.sendFile(__dirname+'/login.html');
})


app.post('/validateToken', (req, res)=>{
	console.log(req.body.idtoken);
})