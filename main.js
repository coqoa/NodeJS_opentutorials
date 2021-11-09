let http = require('http');
let fs = require('fs');
let url = require('url'); //url이라는변수로 url모듈을 사용할 것이다.
let qs = require('querystring');

function templateHTML(title, list, body){
    return `
    <!doctype html>
    <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <a href="/create">create</a>
            ${body}
        </body>
    </html>
    `;
}
function templateList(filelist){
    let list = '<ul>';
        for(i=0; i<filelist.length; i++){
            list = list+`<li><a href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`
        }
        list = list+'</ul>'
    return list;
}

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

            fs.readdir('./data', function(error, filelist){// 배열의 형태로 출력
                let list = templateList(filelist);

                let title = 'Welcome'
                let description = 'Hello, Node.js'

                let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                
                response.writeHead(200); //파일을 성공적으로 전송하면 웹서버는 200이라는 약속된 번호를 돌려준다
                response.end(template); //주소입력값(쿼리스트링)의 id값을 화면에 출력함
            })
            
        }else{
            fs.readdir('./data', function(error, filelist){// 배열의 형태로 출력  
                let list = templateList(filelist);

                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    let title = queryData.id;
                    let template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    
                    response.writeHead(200);
                    response.end(template); 
                });
            });
        }
    }else if(pathname == '/create'){
        fs.readdir('./data', function(error, filelist){// 배열의 형태로 출력
            let list = templateList(filelist);
            let title = 'WEB - create'
            let template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
                <input type="text" name="title" placeholder="title"><br>
                <textarea name="description" placeholder="description"></textarea><br>
                <input type="submit"><br>
            </form>
            `);
            
            response.writeHead(200); //파일을 성공적으로 전송하면 웹서버는 200이라는 약속된 번호를 돌려준다
            response.end(template); //주소입력값(쿼리스트링)의 id값을 화면에 출력함
        })
    }else if(pathname == '/create_process'){
        let body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;

        });
        response.writeHead(200); //파일을 성공적으로 전송하면 웹서버는 200이라는 약속된 번호를 돌려준다
        response.end('success');

    }else{
        response.writeHead(404); //파일을 찾을 수 없으면 웹서버는 404라는 약속된 번호를 돌려준다
        response.end('Not found');
    }
    
});
app.listen(3000);  

// request : 요청할때 웹브라우저가 보낸 정보
// response : 응답할때 웹브라우저에 전송할 정보
// require : 요구하다