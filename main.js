let http = require('http');
let fs = require('fs');
let url = require('url'); //url이라는변수로 url모듈을 사용할 것이다.
const { Z_FIXED } = require('zlib');

let app = http.createServer(function(request,response){
    let _url = request.url;
    // console.log(_url); // queryString을 알아낼 수 있다.
    let queryData = url.parse(_url, true).query;
    let pathname = url.parse(_url, true).pathname;
    // console.log(queryData);// http://localhost:3000/?id=HTML 입력시  {id : 'HTML'} 출력 
    //                           -> queryData의 변수에 담긴 값들은 객체.
    // console.log(queryData.id);// HTML 출력
    
    
    if(pathname == '/'){
        if(queryData.id == undefined){

            fs.readdir('./data', function(error, filelist){
                // 배열의 형태로 출력

                let title = 'Welcome'
                let description = 'Hello, Node.js'
                
                let list = '<ul>';
                for(i=0; i<filelist.length; i++){
                    list = list+`<li><a href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                }
                list = list+'</ul>'

                let template = `
                <!doctype html>
                <html>
                    <head>
                        <title>WEB1 - ${title}</title>
                        <meta charset="utf-8">
                    </head>
                    <body>
                        <h1><a href="/">WEB</a></h1>
                        ${list}
                        
                        <h2>${title}</h2>
                        <p>${description}</p>
                    </body>
                </html>
                `
                response.writeHead(200); //파일을 성공적으로 전송하면 웹서버는 200이라는 약속된 번호를 돌려준다
                response.end(template); //주소입력값(쿼리스트링)의 id값을 화면에 출력함
            })
               
        }else{
            fs.readdir('./data', function(error, filelist){
                // 배열의 형태로 출력

                let title = 'Welcome'
                let description = 'Hello, Node.js'
                
                let list = '<ul>';
                for(i=0; i<filelist.length; i++){
                    list = list+`<li><a href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`
                }
                list = list+'</ul>'

                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    let title = queryData.id;
                    let template = `
                    <!doctype html>
                    <html>
                        <head>
                            <title>WEB1 - ${title}</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                            <h1><a href="/">WEB</a></h1>
                            ${list}
                            <h2>${title}</h2>
                            <p>${description}</p>
                        </body>
                    </html>
                    `
                    response.writeHead(200);
                    response.end(template); 
                });
            });
        }
    }else{
        response.writeHead(404); //파일을 찾을 수 없으면 웹서버는 404라는 약속된 번호를 돌려준다
        response.end('Not found');
    }
    
});
app.listen(3000);  

// require : 요구하다
// 

// 10강 한번 더 보기