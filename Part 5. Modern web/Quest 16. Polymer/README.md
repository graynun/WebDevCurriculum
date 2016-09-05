# Quest 16. Polymer


## Introduction
* 이번 퀘스트에서는 Polymer 프레임워크를 통해 현대적인 웹 클라이언트를 개발하는 법을 알아보겠습니다.

## Topics
* Web Component
* Polymer framework
* Shadow DOM
  * Shady DOM

## Resources
* [Polymer](https://www.polymer-project.org/1.0/)

## Checklist
* Polymer는 어떤 특징을 가지고 있는 웹 프레임워크인가요?
	* custom element를 만들기 쉬움
	* 이미 만들어진 element도 많이 제공(참고: [Polymer element catalog](https://elements.polymer-project.org/))
	* 있는 element의 재사용을 극대화 하려고 노력한 흔적이 많이 보인다(레고처럼 조립식으로 만들고 싶었던듯?)
		* 더 빠른 개발이 가능하다는 장점이 있을듯?
		* 대신 그만큼 customization에 한계가 있을 확률이...
	* package 관리를 bower로 한다...
* Shadow DOM이 무엇인가요?
	* Shadow DOM: 표준 제정중(참조: [W3C Shadow DOM draft](http://w3c.github.io/webcomponents/spec/shadow/))
		* shadow host(document에 있는 element)에서 `createShadowRoot`를 사용해서 해당 element에 shadow root를 생성
		* shadow root 안에 들어가는 Node tree(so-calle shadow tree)는 encapsulation되는 것 같은 느낌 - 내부에서의 CSS나 DOM이 shadow root 밖의 CSS/DOM과 완전히 별도로 떨어진 문서처럼 행동
		* `slot` tag를 사용해서 원래 문서에서 표현하고 싶은 내용을 shadow DOM 의 내용과 함께 표시할 수 있다(참고: [Compositions and slots](https://developers.google.com/web/fundamentals/primers/shadowdom/))
		* shadow DOM 의 반대로 document에 존재하는 DOM은 light DOM 이라고 많이들 부른다...
* Web components가 무엇이고, 이 것을 사용할 때 어떤 점을 유의해야 하나요?
	* html5에서 새로 표준으로 지정하려고 시도중인 요소들
	* HTML Templates 빼고는 아직 브라우저들이 제대도 지원하지 않는 경우가 많아서 polyfill이 필요한 경우가 대다수(참조: [are we componentized yet?](http://jonrimmer.github.io/are-we-componentized-yet/))
	* HTML Templates(WHATWG의 living standard - [참고](https://html.spec.whatwg.org/multipage/scripting.html#the-template-element))
		* html에서 최초에 화면에 그려질 필요가 없는 요소들에 대해서 `template`라는 tag 안에 넣어두고, 필요한 경우 해당 노드를 `importNode`등의 방식으로 복제해서 사용
		* 반복적으로 페이지 안에서 사용되는 경우에도 많이 쓰는듯?(테이블 만드는 예제가 가장 많다)
	* Shadow DOM은 위에서 설명했으니 생략
	* HTML import: 표준 제정중(참조: [W3C HTML Imports](http://w3c.github.io/webcomponents/spec/imports/))
		* node에서 별개의 package들을 import 해서 쓰듯 별개의 HTML파일을 import해서 사용할 수 있는 기능
	* custom elements: 표준 제정중(참조: [W3C Custom Elements](http://w3c.github.io/webcomponents/spec/custom/))
		* HTML에 사전 정의된 mark up tag 뿐 아니라, 사용자가 정의한 tag를 사용할 수 있게 하는 기능
		* 기존에 정의되어 있는 `HTMLElement`를 상속 받아 자신이 원하는 기능을 덧붙이는 방식으로 만들어진다
		* 원하는 class를 먼저 `class CustomElement extends HTMLElement`를 통해 정의하고, `window.customElements.define("tag-name-here", CustomElement)`와 같은 식으로 추가하여 사용한다
			* 근데 `customElement.define`을 정의하는 브라우저는 아직 없다. 기존에 사용하던 `registerElement`는 잘 작동하지만, 공식 스펙에서는 **remove**했다고 나온다.



	
## Quest
* Polymer를 통해 Quest 07에서 만들었던 바탕화면 시스템을 다시 한 번 만들어 보세요.
  * 어떤 Custom Element가 필요한지 생각해 보세요.
  * 각 클래스별로 해당하는 CSS와 자바스크립트를 어떤 식으로 붙여야 할까요?
  * Custom Element간에 데이터를 주고받으려면 어떤 식으로 하는 것이 좋을까요?
* **이제는 개발이 익숙해졌기 때문에 Skeleton code를 제공하지 않습니다!**
  * 이제부터의 퀘스트는 디렉토리 내에 `submit` 폴더를 만들어 제출해 주시면 됩니다.
  * 서버쪽 코드가 필요할 경우 적절한 `package.json` 파일을 포함하여 제출해 주세요!

* polymer-cli를 사용했습니다. 제 코드가 정상적으로 작동하려면 bower와 polymer-cli가 global로 install되어있어야 하며, `bower install`을 하신 이후 `polymer serve` 해주셔야 합니다...