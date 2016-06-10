# Quest 03. Publishing CSS


## Introduction
* 이번 퀘스트에서는 CSS를 이용해 실제 웹 페이지를 모사해 퍼블리싱하는 것에 도전해볼 예정입니다.

## Topics
* 퍼블리싱을 위해 몇 가지 중요한 속성들
  * `font-*`: font 속성 지정. family, size, 등등
  	** cf) 글씨 색의 경우 `font-color` 가 아니라 `color` attribute를 지정해 줘야 한다.
  * `text-*`: text 속성 지정. align, indent, transform 등
  * `box-sizing` : 브라우저가 화면에 표시되는 요소의 크기를 계산할때 padding, border, margin을 포함할지 아닐지 여부 설정.
  	** `content-box`: 크기를 설정하는 경우 padding, border, margin을 제외한 알맹이만의 크기로 계산
  	** `border-box`: 크기를 설정하는 경우 padding, border, margin을 포함한 크기로 계산
  * `:hover`/`:active` : [pseudo class](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)

## Resources
* [MDN - CSS](https://developer.mozilla.org/ko/docs/Web/CSS)
* [모던 웹 디자인을 위한 HTML5+CSS3 입문](http://www.yes24.com/24/Goods/15683538?Acode=101), 한빛미디어
* [웹 디자인 2.0 고급 CSS](http://www.yes24.com/24/Goods/2808075?Acode=101), 에이콘출판사
* [Centering in CSS: A Complete Guide](https://css-tricks.com/centering-css-complete-guide/)
* [A complete guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## Checklist
* CSS 퍼블리싱을 할 때, class와 selector들은 어떤 식으로 정리하는 것이 좋을까요?

## Quest
* Quest 01에서 만들었던 HTML을 바탕으로, [이 그림](github.png)의 레이아웃과 CSS를 최대한 비슷하게 흉내내 보세요. 꼭 완벽히 정확할 필요는 없으나 align 등의 속성은 일치해야 합니다.
* **주의사항: 되도록이면 원래 페이지의 CSS를 참고하지 말고 아무것도 없는 백지에서 시작해 보도록 노력해 보세요!**
* 등장하는 아이콘은 그림파일이 아닌 GitHub에서 만든 [Octicons](https://octicons.github.com/)라는 폰트 파일입니다. 해당 폰트 파일은 폴더에 같이 있으니 링크하여 쓰시면 됩니다.
  * 특정 폰트로 임의의 유니코드 문자를 출력하려면 어떻게 해야 할까요?

## 기타 궁금한거
* normalize.css같은거 만드는 사람들이야 브라우저마자 무엇이 섀도가 들어가는지 border가 들어가는지 알겠지만 보통의 개발자가 그것도 다 알고 있어야 하나...?
** 뭐 최근에는 normalize.css같은걸 잘 안쓴다고 한다. normalize.css의 골자는 브라우저에 상관없이 1px까지 똑같이 보여야 한다 <- 이건데 요새는 딱히 이런데 목숨거는 방향으로 가는거 같진 않다고.
* Mark Up Language가 원래 문서의 '틀'을 만들고 그걸 찍어내는거긴 한데... 어디까지 modulize 하고 어디부터 예외로 처리해야 하나?(클래스나 아이디 이름으로 불러야 하나?)
** 기본 골자인 알맹이(구조포함)은 HTML이, 장식? 꾸밈? 보여지는 방식?은 CSS가... 를 생각해 보면 HTML의 DOM구조를 그대로 가져가는 CSS selector declaration은 딱히 좋은 방법이 아닌 것 같다고.
* `html` / `body`를 별도로 불러줘야 하는 케이스는 어떨때인지?
** 둘을 구분해서 쓸 경우가 생기긴 하나?(html5 기준)
** body에 넣으면 되는데 html에 넣으면 안되는 경우가 있음
** 그렇지만 굳이 이야기하자면 html은 문서 전체에 관련된 것(폰트라든가), body는 진짜 body가 어떻게 보여질지(width등)에 관련된 declaration들이 모여있으면 좋다.
* selector로 무언가를 부를 때 어떤 순서로 만들어주는게 좋은가?
** 동일 selector에 대한 attribute를 주는 경우 마지막에 선언한 것이 적용되는 것은 알겠는데, 그럼 문서 전반에서는 어떤 순으로 불러야 하는가?
** 그냥 역시 순서대로...
** 대신 가장 큰 단위로 레이아웃을 나눌때 namespace설정하듯이 가장 큰 DOM에 대해서 클래스를 unique하게 잘 지어주면 좋다(어차피 HTML tag name만으로 부르면 너무 중복이 많아진다고...)
* 어떨때 클래스 이름만 부르고 어떨때 tag이름까지 불러주는가?
** 클래스 이름만 부르는게 좀 더 흔한 케이스 인 것 같은데, 좀 더 구체적으로 부르는게 좋은게 아닌가?
** 클래스 이름을 unique하게 부르고, 대부분의 경우 tag name을 안부른다. 왜냐면 tag name을 부르면 결국 HTML 문서구조에 의존하는 모양새가 되니까...
* property 어떤 순서로 부르는게 좋은가?
* 하나의 declaration에서 property 많이 지정하는 것은 좋은 행위가 아닌가?
** 뭐 딱히 기준은 없지만 CTO는 
*** position/display
*** width / height
*** position detail
*** border/colour
*** font 정보
** 순으로 부른다고 한다. 그리고 의미가 끊어질때는 엔터도 넣음... 근데 뭐 이건 결국 사람마다 스타일마다 다르다고 한다.