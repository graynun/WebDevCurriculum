# Quest 10. Hello, node.js


## Introduction
* 이번 퀘스트에서는 node.js의 기본적인 구조와 개념에 대해 알아 보겠습니다.

## Topics
* 꼭 알아야 하는 것들
  * node.js
  * npm
  * `require()` 함수
  * module.exports

## Resources
* [Node.js 노드제이에스 프로그래밍](http://www.yes24.com/24/Goods/6271069?Acode=101), 에이콘출판사
* [모던 웹을 위한 Node.js 프로그래밍](http://www.yes24.com/24/Goods/10991708?Acode=101), 한빛미디어

## Checklist
* node.js는 어떤 식으로 동작하나요?
  * `require()` 함수는 어떻게 쓰는 것인가요?
    * `var aaa = require('aaa');` 
    * 외부(위의 코드가 작성된 파일이 아닌 다른 곳)의 모듈을 불러들여 특정 변수에 저장하고 사용한다.
  * `module.exports`와 `exports` 변수는 어떻게 다른가요?
    * `module.exports`는 Module system에 의해 만들어지는 object. 모듈 밖에서 해당 모듈을 `require`할 때 실제로 넘어 갈 내용이 들어가있는 object
    * `exports` 변수는 단순히 `module.exports`의 alias로 자주 사용될 뿐 다른 변수들과 같다. 즉, 내가 만든 module js file 내부에서 `exports`에 내가 원하는 object / function / etc.를 넣어주어도 밖에서 `require()`로 부를 수 없다.

* npm이 무엇인가요?
  * Node Package Manager. 패키지 관리자로 package.json을 통해서 원하는 패키지를 설치할 수 있게 해준다.
  * npm 패키지를 `-g` 옵션을 통해 Global로 저장하는 것과 그렇지 않은 것은 어떻게 다른가요?
    * global로 특정 패키지를 저장하는 경우 `{prefix}/lib/node_modules`에 해당 패키지(모듈)가 저장되며, `{prefix}/bin`에 실행 가능한 파일이 등록된다. 이렇게 되는 경우 command line에서도 해당 모듈을 불러서 사용 가능해진다.
    * 참고: [npm 1.0: Global vs Local installation](https://nodejs.org/en/blog/npm/npm-1-0-global-vs-local-installation/)

## Quest
* node.js를 PC에 설치해 보세요. 버전은 5.x 버전이 적당합니다!
* 커맨드 라인에서 다음과 같은 명령을 쳤을 때 위 파일들의 내용이 나타나도록 해 보세요.
  * `$ node app.js 1`
    *
        ~~~
        {
            name: 'Config1',
            var1: 'aaa',
            var2: [1, 2, 3, 4]
        }
        ~~~

  * `$ node app.js 2`
    * 
        ~~~
        {
            name: 'Config2',
            var1: 'bbb',
            var2: [2, 3, 4, 5]
        }
        ~~~
* 단, 주어진 스켈레톤 코드에서 app.js는 변경할 수 없습니다.
