# Quest 05. Playing with DOM


## Introduction
* 이번 퀘스트에서는 자바스크립트를 통해 브라우저의 실제 DOM 노드를 조작하는 법에 대하여 알아볼 예정입니다.

## Topics
* DOM API
  * `document` 객체
  ** Document interface는 웹페이지의 콘텐트(DOM tree)에 접근할 수 있도록 하는 entry point 기능을 한다[Document, mdn](https://developer.mozilla.org/en/docs/Web/API/Document)
  ** Document의 Methods는 Node와 EventTarget interface를 inherit 받음
  ** ParentNode interface를 통해 extend되어서 우리가 많이 쓰는 아래의 element selector method들이 존재한다;
  * `document.getElementById()`, `document.querySelector()`, `document.querySelectorAll()` 함수들
  ** DOM tree에서 특정 DOM을 찾기 위한 함수들. 
  ** `document.getElementById(string)`: attribute중 해당 ID를 가진 DOM의 reference를 return. 동일 ID를 가진 DOM이 여러개면 가장 처음에 해당 id를 가진 DOM return.
  ** `document.querySelector(string selector)`: 해당 selector에 해당하는 첫 번째 element return. string selector 두 개 이상 사용 가능.
  ** `document.querySelectorAll(string selector)`: 해당 selector에 해당하는 element들의 list return. string selector 두 개 이상 사용 가능.
  ** querySelector 들은 "depth-first pre-order traversal of the document's nodes" - 상위 element일수록, 문서에서 먼저 나올수록(pre-order) '앞쪽'이라고 간주한다.
  * 기타 DOM 조작을 위한 함수와 속성들
* Closure

## Resources
* [자바스크립트 완벽 가이드](http://www.yes24.com/24/Goods/8275120?Acode=101), 인사이트
* [자바스크립트 객체지향 프로그래밍](http://www.yes24.com/24/Goods/7276246?Acode=101), 위키북스

## Checklist
* 자바스크립트를 통해 DOM 객체에 CSS Class를 주거나 없애려면 어떻게 해야 하나요?
	* `element.classList`를 하면 해당 element에 있는 class들을 담은 object가 return된다
		* 여기에 `add`, `remove` Method를 사용해서 주거나 없앤다.
  * IE9나 그 이전의 옛날 브라우저들에서는 어떻게 해야 하나요?
	** 줄때: `document.getElementById()`, `document.querySelector()`, `document.querySelectorAll()` 등을 사용해서 해당 element를 선택한 뒤 `element.className += "className"`
	** 없앨때: 정규표현식으로 해당 className을 replace하라는데 (참고:[여기](http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript)) 그냥 `element.className = ""` 하면 안되나여...
* 자바스크립트의 Closure는 무엇이며, 어떤 식으로 활용할 수 있나요?

## Quest
* Skeleton 디렉토리에 주어진 HTML을 조작하는 스크립트를 완성해 보세요.
  * 첫째 줄에 있는 사각형의 박스들을 클릭할 때마다 배경색이 노란색->흰색으로 바뀌어야 합니다.
  * 둘째 줄에 있는 사각형의 박스들을 클릭할 때마다 `enabled`라는 이름의 CSS Class가 클릭된 DOM 노드에 추가되거나 제거되어야 합니다.
* 구현에는 여러 가지 방법이 있으나, 다른 곳은 건드리지 않고 TODO 부분만 고치는 방향으로 하시는 것을 권장해 드립니다.
