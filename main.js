var http = require('http');
var fs = require('fs');
var url = require('url'); //url이라는변수로 url모듈을 사용할 것이다.

var app = http.createServer(function(request,response){
    var _url = request.url;
    // console.log(_url); // queryString을 알아낼 수 있다.
    var queryData = url.parse(_url, true).query;
    // console.log(queryData);// http://localhost:3000/?id=HTML 입력시  {id : 'HTML'} 출력 
    //                           -> queryData의 변수에 담긴 값들은 객체.
    // console.log(queryData.id);// HTML 출력
    var title = queryData.id;
    if(_url == '/'){
       title = 'Welcome';
    }
    if(_url == '/favicon.ico'){
        response.writeHead(404);
        response.end();
        return;
    }
    response.writeHead(200);
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
  <p><a href="https://www.w3.org/TR/html5/" target="_blank" title="html5 speicification">Hypertext Markup Language (HTML)</a> is the standard markup language for <strong>creating <u>web</u> pages</strong> and web applications.Web browsers receive HTML documents from a web server or from local storage and render them into multimedia web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.
    <img src="coding.jpg" width="100%">
</p><p style="margin-top:45px;">HTML elements are the building blocks of HTML pages. With HTML constructs, images and other objects, such as interactive forms, may be embedded into the rendered page. It provides a means to create structured documents by denoting structural semantics for text such as headings, paragraphs, lists, links, quotes and other items. HTML elements are delineated by tags, written using angle brackets.
</p>
</body>
</html>

    `
    // console.log(__dirname + url);

    // response.end(fs.readFileSync(__dirname + _url));
    // response.end('egoing : '+url); //egoing : /3.html을 화면에 출력함

    response.end(template); //주소입력값(쿼리스트링)의 id값을 화면에 출력함

});
app.listen(3000);  

// require : 요구하다
// 

// 10강 한번 더 보기