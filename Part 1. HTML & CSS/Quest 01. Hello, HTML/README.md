# Quest 01. Hello, HTML


## Introduction
* HTML은 HyperText Markup Language의 약자로, 웹 브라우저에 내용을 표시하기 위한 가장 기본적인 언어입니다. 이번 퀘스트를 통해 HTML에 관한 기초적인 사항들을 알아볼 예정입니다.

## Topics
* 브라우저의 역사
  * Mosaic
  * Netscape
  * Internet Explorer
  * Firefox
  * Chrome
  * Safari (for iOS)
* HTML 표준의 역사
  * HTML 4.01
  * XHTML 1.0, XHTML 1.1
  * XHTML 2.0
  * HTML5
* HTML 문서의 구조
* HTML 문서의 엘리먼트
  * Semantic elements
  * Block-level elements vs Inline elements

## Resources
* [MDN - HTML](https://developer.mozilla.org/ko/docs/Web/HTML)
* [모던 웹 디자인을 위한 HTML5+CSS3 입문](http://www.yes24.com/24/Goods/15683538?Acode=101), 한빛미디어
* [웹 디자인 2.0 고급 CSS](http://www.yes24.com/24/Goods/2808075?Acode=101), 에이콘출판사
* [StatCounter Global Stats](http://gs.statcounter.com/)

## Checklist
* HTML 4.x 이후의 HTML 표준의 변천사는 어떻게 되나요?
  * HTML 4.01 중단 => XHTML 1.0 recommendation => XHTML 1.1 recommendation => XHTML 2.0(specification), 별도의 HTML working group 출범(WHATWG) => HTML 5(W3C, WHATWG의 작업 내용을 기반으로 함) => XHTML 2.0 drop(W3C)
* MS와 IE는 왜 역사의 죄인이 되었을까요?
  * 점유율은 높은데(윈도우즈에 붙는 독점 브라우저!) 불안정하고 표준을 지켜서 구현되지도 않고(표준에서 권고하는 태그들을 MS마음대로 만들거나 아예 안만들거나...)rendering issue가 많다...
    * 그렇다면 MS가 OS 점유율이 그렇게 높지 않았다면, 가령 Mac OS X가 더 높다고 한다면, IE가 아니라 Safari가 악의 축이 되었을까?
* `<section>`과 `<div>`, `<header>`, `<footer>`, `<article>` 엘리먼트의 차이점은 무엇인가요?
  * Semantic element; 문서의 의미를 구분하는 단위로 쓰이는 tag들. `<header>`, `<footer>`, `<article>`, `<section>` 등은 웹크롤러가 긁어서도 문서 내부의 의미단위를 구분할 수 있지만, `<div>`는 아무 의미가 없음.
* 블럭 레벨 엘리먼트와 인라인 엘리먼트의 차이는 무엇일까요?
  * (의미상 구분 등의 이유로) 화면에서 한 줄(화면의 width 전체)을 독립적으로 차지하는 요소 / 특정 요소 내부에서 삽입된 것 처럼 한 줄 전체를 차지하는 것이 아니라 일부분만 차지하는 요소

## Quest
* [이 그림](github.png)은 github의 웹사이트 레이아웃입니다. 이 레이아웃의 정보를 HTML 문서로 표현해 보세요.
* CSS를 전혀 사용하지 않고, 문서의 구조가 어떻게 되어 있는지를 파악하여 구현해 보세요.
  * [CSS Naked Day](http://meiert.com/en/blog/20150319/css-naked-day/)는 매년 4월 9일에 CSS 없는 웹 페이지를 공개하여 내용과 마크업에 집중한 HTML 구조의 중요성을 강조하는 행사입니다.
* 폴더에 있는 `skeleton.html` 파일을 바탕으로 작업해 보시면 됩니다.
