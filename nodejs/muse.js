// let M = {
//     v: 'v',
//     f: function(){
//         console.log(thios.v);
//     }
// }
// M.f();

let part = require('./mpart.js');
console.log(part);  // 모듈화한(module.exports에 값으로 대입한 객체) //{ v:'v', f: [Function: f]}
part.f();
