let http = require('http');
let fs = require('fs');
let url = require('url'); //url이라는변수로 url모듈을 사용할 것이다.
const { Z_FIXED } = require('zlib');

let app = http.createServer(function(request,response){
    let _url = request.url;
    // console.log(_url); // queryString을 알아낼 수 있다.
    let queryData = url.parse(_url, true).query;
    // console.log(queryData);// http://localhost:3000/?id=HTML 입력시  {id : 'HTML'} 출력 
    //                           -> queryData의 변수에 담긴 값들은 객체.
    // console.log(queryData.id);// HTML 출력
    let title = queryData.id;
    if(_url == '/'){
        title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
    fs.readFile(`data/${title}`, 'utf8', function(err, description){

        let template = `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        <ol>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
        </ol>
        <h2>${title}</h2>
        <p>${description}</p>
        </body>
        </html>
        
        `
        // console.log(__dirname + url);
        
        // response.end(fs.readFileSync(__dirname + _url));
        // response.end('egoing : '+url); //egoing : /3.html을 화면에 출력함
        
        response.end(template); //주소입력값(쿼리스트링)의 id값을 화면에 출력함
    });
        
});
app.listen(3000);  

// require : 요구하다
// 

// 10강 한번 더 보기