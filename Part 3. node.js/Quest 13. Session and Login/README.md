# Quest 13. Session and Login


## Introduction
* 이번 퀘스트에서는 로그인 기능이 어떻게 구현되는지를 알아보겠습니다.

## Topics
* Cookie
* Session
* Chrome developer tools > 'Resources' tab

## Resources
* [Express Framework](http://expressjs.com/)
  * [express-session](https://github.com/expressjs/session)
* [자바스크립트 완벽 가이드](http://www.yes24.com/24/Goods/8275120?Acode=101), 인사이트
* [자바스크립트 객체지향 프로그래밍](http://www.yes24.com/24/Goods/7276246?Acode=101), 위키북스

## Checklist
* 쿠키란 무엇일까요?
	* 웹서버가 사용자의 하드디스크에 저장하는 텍스트. url과 name - value pair를 저장한다.
  * 쿠키는 어떤 식으로 동작하나요?
  	* 클라이언트(브라우저)가 특정 url로 request를 보낼 때 자신의 storage에 해당 url의 쿠키가 존재하는지 찾아본다.
  		* 쿠키가 존재하는 경우 쿠키 정보를 request에 함께 보낸다
  	* 해당 url의 주인인 웹서버는 리퀘스트에 쿠키 정보를 받은 경우, 웹서버가 가지고 있는 저장공간(DB 등)에서 해당 정보를 찾아서 아용한다.
  	* 쿠키가 함께 보내지지 않은 경우, 해당 웹서버는 이전에 접속한 적이 없는 사용자라는 것을 판단하고 새로운 value를 만들어서 response를 보낼때 name - value 를 쿠키로 함께 보낸다.
  * 쿠키는 어떤 식으로 서버와 클라이언트 사이에 정보를 주고받나요?
  	* http request - response를 보낼때 함께 보낸다. 
  	* 클라이언트에서 서버로 request를 보내는 경우, 사용자의 저장공간에 저장된 쿠키 정보(name-value)를 보낸다
  	* 서버에서 클라이언트로 response를 보내는 경우, request에서 보냈던 쿠키의 내용을 바꿔서 저장할 수도 있다
* 웹 어플리케이션의 세션이란 무엇일까요?
  * 세션의 내용은 어디에, 어떤 식으로 저장되나요?
  	* 클라이언트에 저장되는 경우: cookie 안에 session ID의 형식으로 저장됨 
  	* 서버에 저장되는 경우:

## Quest
* Quest 12에서 수행했던 메모장에 로그인 기능을 넣고자 합니다.
  * 사용자는 딱 세 명만 존재한다고 가정하고, 아이디와 비밀번호, 사용자의 닉네임은 하드코딩해도 무방합니다.
  * 로그인했을 때 해당 사용자가 이전에 작업했던 탭들과 상태가 로딩 되어야 합니다.
