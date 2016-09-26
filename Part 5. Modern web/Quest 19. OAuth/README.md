# Quest 19. OAuth


## Introduction
* 이번 퀘스트에서는 웹사이트들에서 보이는 페이스북이나 구글 로그인 기능은 어떻게 만드는지 알아보겠습니다.

## Topics
* OAuth 2.0
* OpenAPI

## Resources
* [OAuth](https://en.wikipedia.org/wiki/OAuth)
* [Google OAuth API HowTo](https://developers.google.com/identity/protocols/OAuth2)
* [node.js Google OAuth API](https://github.com/google/google-api-nodejs-client/)
* [Google Developers Console](https://console.developers.google.com)

## Checklist
* 페이스북이나 구글같은 회사는 어떤 식으로 다른 사이트에게 사용자 비밀번호를 넘기지 않고 사용자 인증을 해 줄 수 있을까요?
	* 어떤 웹/앱에서 정해진 규약대로 요청하는 인증의 경우 자신의 사이트 로그인 페이지로 연결하고, 정상적으로 로그인이 되는 경우 해당 웹에서 사용자 정보를 조회할 수 있도록 API를 열어주는 식
  * 구글의 경우 해당 API에서 사용할 수 있는 키(access token)에 사용자 정보(identifier), 인증을 요청했던 앱, 유호기간 등의 정보를 포함하고 있고, API에 이 토큰을 사용해서 사용자에게 필요한 정보들을 요청할 수 있는 구조인듯
  * OAuth란 무엇인가요?
    * 사용자의 비밀번호를 노출하지 않고 OAuth를 제공하는 서비스들을 사용하여 사용자를 인증하는 공개 규약
  * OAuth를 통해 사용자 인증을 할 때 어떤 경로로 어떤 정보가 흘러가야 할까요?
  	* Client에서 OAuth 제공하는 사이트에 정해진 규약대로 authentication 요청
  	* OAuth 제공 사이트에서 인증 내용이 client로 돌아옴(Google의 경우 유효 기간, 클라이언트 정보 등이 포함된 access token이 발급됨)
  	* client는 다시 앱서버로 받은 정보(access token등) 전달
    * 앱서버는 access token으로부터 필요한 정보 획득(프로필 정보 등)
  	

## Quest
* Quest 12~15에서 만든 메모장 시스템에 구글 로그인 버튼을 추가하고자 합니다.
  * 구글 버튼을 통해 로그인을 할 수 있어야 합니다.
    * 처음 로그인했을 경우, 해당하는 유저 테이블에 이메일 주소와 해당하는 사람의 이름이 추가되게 됩니다.
    * 두 번째 로그인부터는 일치하는 이메일 주소를 찾아 그 유저의 이름으로 모든 것이 저장되어야 합니다.
