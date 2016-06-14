# Quest 04. Hello, JavaScript


## Introduction
* 이번 퀘스트에서는 자바스크립트의 기본적인 문법에 대해 알아볼 예정입니다.

## Topics
* 기본적인 자바스크립트 문법
  * 원시 데이터 타입(primitive data type)과 연산자
    * Primitive Data types in Javascript
      ** Boolean
      ** Null
      ** Undefined: A variable that has not been assigned a value has the value undefined(출처: [mdn](https://developer.mozilla.org/en/docs/Web/JavaScript/Data_structures))
      ** Number
      ** String
      ** Symbol(in ECMAScript6)
    * Operators
      ** Bitwise operation을 쓸 일이 생기나...? 생긴다면 언제?
  * `var`
  * `if`
  * `for`
  * `function`

## Resources
* [자바스크립트 완벽 가이드](http://www.yes24.com/24/Goods/8275120?Acode=101), 인사이트
* [자바스크립트 객체지향 프로그래밍](http://www.yes24.com/24/Goods/7276246?Acode=101), 위키북스

## Checklist
* 웹 브라우저의 자바스크립트 콘솔은 어떻게 사용할까요?
  ** 개발자 도구 > Console!
  * 웹 브라우저(Chrome)에서 자바스크립트 콘솔을 띄우는 단축키는 무엇인가요?
  ** `cmd` + `option` + i
* `var`를 이용하여 변수를 선언하는 것은 그렇게 하지 않는 것과 어떤 면에서 다를까요?
  * var를 붙이지 않는 variable(Undeclared variable)은 무조건 global variable이 된다. 단, strict mode에서는 에러남...
  * declared variable은 코드가 실행될 때 가장 먼저 만들어짐(hoisting된다고 한다: 코드에서 declared variable들이 가장 먼저 실행된 뒤에 나머지 코드들이 돌아감). 반면 undeclared variable은 value가 들어갈 때 까지는 존재하지도 않음.
  * undeclared variable은 "configurable"(지울수도 있음). 반면 declared variable은 non-configurable.
* 자바스크립트의 익명 함수는 무엇인가요?
  * "named identifier"가 없이 declare된 함수. 
~~~~
function `Named Identifier`(){/* function 내용 */}
~~~~

## Quest
* 초보 프로그래머의 영원한 친구, 별찍기 프로그램입니다.
  * [이 그림](jsStars.png)과 같이, 입력한 숫자만큼 삼각형 모양으로 콘솔에 별을 그리는 퀘스트 입니다.
    * 줄 수를 입력받고 그 줄 수만큼 별을 그리면 됩니다. 위의 그림은 5를 입력받았을 때의 결과입니다.
  * `if`와 `for`와 `function`을 모두 써서 프로그래밍 하면 더 좋은 코드가 나올 수 있을 것 같습니다.
  * 입력은 `prompt()` 함수를 통해 받을 수 있습니다.
  * 출력은 `console.log()` 함수를 통해 할 수 있습니다.
* 워밍업을 위한 퀘스트이므로 Skeleton code는 없습니다!
