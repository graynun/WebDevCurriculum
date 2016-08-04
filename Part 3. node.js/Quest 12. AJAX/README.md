# Quest 12. AJAX


## Introduction
* 이번 퀘스트에서는 드디어 서버와 클라이언트로 구성된 어플리케이션을 만들어 보겠습니다.

## Topics
* expressJS
* `setTimeout()`
* AJAX, `XMLHttpRequest`, `fetch()`

## Resources
* [Express Framework](http://expressjs.com/)
* [자바스크립트 완벽 가이드](http://www.yes24.com/24/Goods/8275120?Acode=101), 인사이트
* [자바스크립트 객체지향 프로그래밍](http://www.yes24.com/24/Goods/7276246?Acode=101), 위키북스
* [HTTP Node.js v5.3.0 Manual & Documentation](https://nodejs.org/api/http.html)

## Checklist
* 어떠한 자바스크립트 코드가 HTTP 응답이나 사용자의 이벤트등에 종속되어 언제 실행되어야 할 지 알기 어려울 때엔 어떻게 해야 할까요?

* 브라우저의 `XMLHttpRequest` 객체는 무엇이고 어떻게 동작하나요?
	* 서버와 클라이언트 사이에 데이터를 주고받을 수 있도록 하는 클라이언트 기능을 제공하는 API(출처:[mdn](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest))
	* 페이지 새로고침 없이 url(여기선 서버에 가까운듯)에서 정보를 받아올 수 있음
	* 이름과 다르게 XML뿐 아니라 다른 데이터 타입(JSON 등)도 주고받을 수 있고, http이외의 프로토콜(file / htp)도 지원
	* 클라이언트에서 XMLHttpRequest object를 만들어서 request에 필요한 정보(예: http request method, request header, response가 왔을때 실행될 함수 등등)를 지정해주고 서버에 request를 보내면 됨(`XMLHttpRequest.send();`)
* `fetch` API는 무엇이고 어떻게 동작하나요?
	* 특정 URL에 resource를 요청해서 받아올 때 XMLHttpRequest object를 만들어서 각종 설정(성공/실패하는 경우 eventlistener 달아주기, open / send 해주기 등)을 하는 대신에 fetch라는 interface로 좀 더 간편하게 할 수 있게 됨
	* `fetch(url, [option]).then(function(response){}, function(reject){})`의 구조로 간단하게 http request 요청 / response에 대해서 처리해 줄 수 있음
	* `fetch`는 Promise object를 return하기 때문에 `.then()`과 같은 모양새로 response에 대한 처리가 가능해짐(참조: [Javascript Promises](http://www.html5rocks.com/en/tutorials/es6/promises/))
	
## Quest
* 자바스크립트를 이용하여 간단한 웹브라우저 기반의 텍스트 파일 메모장을 만들어 보겠습니다.
  * 먼저 연습으로 Quest 11의 GET/POST 요청을 AJAX를 통해 처리하는 것을 시도해 보세요!
    * 화면에 출력되는 대신 콘솔에 결과가 나오면 됩니다.
  * 새 파일, 로드, 저장, 수정 등의 기능이 있어야 합니다.
  * 탭을 통해 여러 개의 파일을 동시에 편집할 수 있어야 합니다.
  * 이 메모장의 메모들은 서버의 파일시스템에 그대로 저장되어야 합니다.
* `skeleton` 디렉토리에서 작업을 하시되, 작업을 시작하기 전에 해당 디렉토리에서 `npm install` 명령을 날리시면 자동으로 express가 설치됩니다.
