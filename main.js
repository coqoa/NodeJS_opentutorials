let http = require('http');
let fs = require('fs');
let url = require('url'); //url이라는변수로 url모듈을 사용할 것이다.
let qs = require('querystring');

let template = {
    HTML: function(title, list, body, control){
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
                ${control}
                ${body}
            </body>
        </html>
        `;
    }, list: function(filelist){
        let list = '<ul>';
            for(i=0; i<filelist.length; i++){
                list = list+`<li><a href ="/?id=${filelist[i]}">${filelist[i]}</a></li>`
            }
            list = list+'</ul>'
            return list
    }
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
                let title = 'Welcome'
                let description = 'Hello, Node.js'
                let list = template.list(filelist);
                let html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                
                response.writeHead(200); //파일을 성공적으로 전송하면 웹서버는 200이라는 약속된 번호를 돌려준다
                response.end(html); //주소입력값(쿼리스트링)의 id값을 화면에 출력함
            })
        }else{
            fs.readdir('./data', function(error, filelist){// 배열의 형태로 출력  
                let list = template.list(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                    let title = queryData.id;
                    let html = template.HTML(title, list,
                        `<h2>${title}</h2>${description}`,
                        `<a href="/create">create</a>
                        <a href="/update?id=${title}">update</a>
                        <form action="/delete_process" method="post" onsubmit="정말삭제하겠습니까">
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`
                    );
                    
                    response.writeHead(200);
                    response.end(html); 
                });
            });
        }
    }else if(pathname == '/create'){
        fs.readdir('./data', function(error, filelist){// 배열의 형태로 출력
            let list = template.list(filelist);
            let title = 'WEB - create'
            let html = template.HTML(title, list, `
            <form action="/create_process" method="post">
                <input type="text" name="title" placeholder="title"><br>
                <textarea name="description" placeholder="description"></textarea><br>
                <input type="submit"><br>
            </form>
            `,'');
            
            response.writeHead(200); //파일을 성공적으로 전송하면 웹서버는 200이라는 약속된 번호를 돌려준다
            response.end(html); //주소입력값(쿼리스트링)의 id값을 화면에 출력함
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
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            })
        });
    }else if(pathname == '/update'){
        fs.readdir('./data', function(error, filelist){// 배열의 형태로 출력  
            let list = template.list(filelist);

            fs.readFile(`data/${queryData.id}`, 'utf8', function(err, description){
                let title = queryData.id;
                let html = template.HTML(title, list,
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <input type="text" name="title" placeholder="title" value="${title}"><br>
                        <textarea name="description" placeholder="description">${description}</textarea><br>
                        <input type="submit"><br>
                    </form>
                    `,
                    `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html); 
            });
        });
    }else if(pathname == '/update_process'){
        let body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            let post = qs.parse(body);
            let id = post.id;
            let title = post.title;
            let description = post.description;
            fs.rename(`data/${id}`,`data/${title}`, function(error){
                fs.writeFile(`data/${title}`, description, 'utf8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            })
        });
    }else if(pathname == '/delete_process'){
        let body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            let post = qs.parse(body);
            let id = post.id;
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            })
        });

    }else{
        response.writeHead(404); //파일을 찾을 수 없으면 웹서버는 404라는 약속된 번호를 돌려준다
        response.end('Not found');
    }
    
});
app.listen(3000);  

// request : 요청할때 웹브라우저가 보낸 정보
// response : 응답할때 웹브라우저에 전송할 정보
// require : 요구하다