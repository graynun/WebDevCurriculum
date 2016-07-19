# Quest 11. My little web server


## Introduction
* 이번 퀘스트에서는 간단한 웹서버를 만들어 보겠습니다.

## Topics
* GET/POST
* node.js `http` module
  * `req`와 `res` 객체

## Resources
* [HTTP Node.js v5.3.0 Manual & Documentation](https://nodejs.org/api/http.html)
* [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop)

## Checklist
* HTTP의 GET과 POST 메소드는 어떻게 다른가요?
	* `GET`: request URI에서 확인된 정보를 받아온다. (HTTP를 사용하는 서버라면 필수로 구현해야함)
	* `POST`: 서버에 데이터를 보내며, 특정 행동을 하도록 trigger한다(예: DB업데이트). side-effects(해당 메소드를 부르기 전/후 서버에 변화)가 있을 수 있다.
  * 다른 HTTP 메소드에는 무엇이 있나요?
  	* `HEAD`: GET과 더불어서 필수로 지원되어야 하는 method. GET과 똑같지만 body를 제외한 내용만 받아온다. (HTTP를 사용하는 서버라면 필수로 구현해야함)
  	* `PUT`: 서버에 새로운 resource를 업로드한다. 
  	* `DELETE`: 서버에서 resource를 삭제한다.
  	* `OPTIONS`: 서버가 어떤 HTTP 메소드를 실행할 수 있는지 확인한다.
  	* `TRACE`: 메시지가 proxy를 거쳐 서버에 도달하는 과정을 추적한다.

* HTTP 서버에 GET과 POST를 통해 데이터를 보내려면 어떻게 해야 하나요?
	*`GET`: URL에 정보를 함께 보내거나(ex: `GET /zboard.php?id=ppomppu`), header에 custom key를 추가해서 보낸다.
	* `POST`: `GET`과 똑같이 하거나, body에 정보를 실어서 보낸다.
		* POST body content-type:
			* `x-www-urlencoded`: `GET`의 url과 같은 형식. file은 보낼 수 없다
			* `multipart/form-data`: form이 text뿐 아니라 file upload를 포함할 때
			* 기타: text(`text/plain`), JSON(`application/json`), javascript(`application/javascript`), XML(`application/xml`), XML(`text/xml`), html(`text/html`)

## Quest
* 다음의 동작을 하는 서버를 만들어 보세요.
  * 브라우저의 주소창에 `http://localhost:8080`을 치면 `Hello World!`를 응답하여 브라우저에 출력하는 서버를 만들어 보세요.
  * 서버의 `/foo` URL에 `bar` 변수로 임의의 문자열을 GET 메소드로 보내면, `Hello, [문자열]`을 출력하는 서버를 만들어 보세요.
  * 서버의 `/foo` URL에 `bar` 변수로 임의의 문자열을 POST 메소드로 보내면, `Hello, [문자열]`을 출력하는 서버를 만들어 보세요.
* express.JS와 같은 외부 프레임워크를 사용하지 않고 만들어 보세요.
