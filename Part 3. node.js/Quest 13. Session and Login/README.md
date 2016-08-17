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
  	* 해당 url의 주인인 웹서버는 리퀘스트에서 쿠키 정보를 받은 경우, 웹서버가 가지고 있는 저장공간(DB 등)에서 해당 정보를 찾아서 아용한다.
  	* 쿠키가 함께 보내지지 않은 경우, 해당 웹서버는 이전에 접속한 적이 없는 사용자라는 것을 판단하고  response를 보낼때 name - value 를 쿠키로 함께 보낸다.
  * 쿠키는 어떤 식으로 서버와 클라이언트 사이에 정보를 주고받나요?
  	* http request - response를 보낼때 함께 보낸다. 
  	* 클라이언트에서 서버로 request를 보내는 경우, 사용자의 저장공간에 저장된 쿠키 정보(name-value)를 보낸다
  	* 서버에서 클라이언트로 response를 보내는 경우, request에서 보냈던 쿠키의 내용을 수정/삭제해서 저장할 수도 있다
* 웹 어플리케이션의 세션이란 무엇일까요?
	* 민감한 정보(사용자 정보(ID, 비밀번호, 인증여부 등))를 쿠키로 그냥 클라이언트에 저장하는 경우 보안상 문제가 생길 수 있으므로 클라이언트에서 읽을 수 없도록 특정 상태 이후(주로 authentication) 서버는 클라이언트에게 session ID만을 저장하게 하고, 매 요청마다 session ID를 함께 보내도록 한다. 서버는 session ID와 그와 관련된 정보를 함께 저장하고 있다가 해당 정보를 확인하여 필요한 요청을 수행. stateless한 http request에서도 연속성을 가질 수 있게 해주는 것
	* session cookie는 임시로 클라이언트에 저장되며, 사용자가 브라우저를 닫는 경우 대부분 삭제됨.
  * 세션의 내용은 어디에, 어떤 식으로 저장되나요?
  	* 클라이언트: cookie 안에 session ID(connect.sid)의 형식으로 저장됨 
  	* 서버: 저장공간(fs, DB, etc)에 session ID와 그에 관련된 정보(사용자ID, 인증 여부 등)를 저장
  		* 서버의 세션 저장은 express-session의 경우 기본은 메모리에 저장. production 용으로는 redis나 mongo를 많이 사용(참조: [compatible session store](https://github.com/expressjs/session#compatible-session-stores))

## Quest
* Quest 12에서 수행했던 메모장에 로그인 기능을 넣고자 합니다.
  * 사용자는 딱 세 명만 존재한다고 가정하고, 아이디와 비밀번호, 사용자의 닉네임은 하드코딩해도 무방합니다.
  * 로그인했을 때 해당 사용자가 이전에 작업했던 탭들과 상태가 로딩 되어야 합니다.
