# Quest 02. Hello, CSS


## Introduction
* CSS는 Cascading StyleSheet의 약자입니다. 웹브라우저에 표시되는 HTML 문서의 스타일을 지정하는 (거의) 유일하지만 다루기 쉽지 않은 언어입니다. 이번 퀘스트를 통해 CSS의 기초적인 레이아웃 작성법을 알아볼 예정입니다.

## Topics
* CSS 기초 문법
* CSS를 HTML에 적용하는 세 가지 방법
  * Inline Style
  * `<style>`
  * `<link rel="stylesheet" href="...">`
* 레이아웃을 위해 몇 가지 중요한 속성들
  * `position`
  * `left`/`top`
  * `display`
  * `width`/`height`
  * `display: flex;`
  * CSS Box Model
* 브라우저별 Developer tools

## Resources
* [MDN - CSS](https://developer.mozilla.org/ko/docs/Web/CSS)
* [모던 웹 디자인을 위한 HTML5+CSS3 입문](http://www.yes24.com/24/Goods/15683538?Acode=101), 한빛미디어
* [웹 디자인 2.0 고급 CSS](http://www.yes24.com/24/Goods/2808075?Acode=101), 에이콘출판사
* [Centering in CSS: A Complete Guide](https://css-tricks.com/centering-css-complete-guide/)
* [A complete guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)

## Checklist
* CSS를 HTML에 적용하는 세 가지 방법의 장단점은 무엇인가요?
  * inline
    * 장점: 빠르게 적용/수정 가능. 세 가지 중 가장 우선순위가 높게 적용됨. 규모가 작은 사이트의 경우 파일을 별도로 분리할 필요 없이 파일 하나로 적용가능.
    * 단점: 재사용 불가능. 같은 속성을 적용하는 다양한 element가 있는 경우 매번 선언해줘야하며, 유지보수도 까다로워짐. pseudo-elements/class의 경우 적용 불가능.
  * internal
    * 장점: 페이지를 그릴 때 html 이외의 파일을 받지 않아도 됨. pseudo-elements/class 사용가능.
    * 단점: 여러개의 html페이지를 그리는 경우 반복해서 써줘야됨. html파일 자체의 사이즈가 커짐 => inline/external CSS에 비해서 상대적으로 느림.
  * external
    * 장점: 여러개의 페이지에 대해서 (상대적으로) 잘 구조화되게 만들고 적용/재사용 가능. html 파일 사이즈 작음
    * 단점: html 이외의 별도의 파일을 생성 => 느린 로딩속도. 별도의 파일에 분리되어 있어서 해당 스타일을 찾아볼때 귀찮음...
* 여러 개의 CSS 규칙이 한 개의 대상에 적용될 때, 어떤 규칙이 우선순위를 가지게 되나요?
  * inline > internal > external
  * Specificity: ID selector(#id) > class selector(.class) / attribute selector([type=input]) / pseudo-class(:hover) > type selector(div, section, h1) / pseudo-element(::before)
  * 같은 specificity를 가진 경우 마지막에 선언된 스타일
    * cf) pseudo-class vs pseudo-element
        * pseudo-class는 개별 element의 특별한 상태를 명시. html의 트리구조 뿐 아니라 외부적 요인(해당 페이지의 과거 방문기록 유무)이나 해당 요소의 상태, 혹은 마우스의 위치 등에 따라서 다른 스타일 적용 가능하게 함.
        pseudo-element는 element의 '특정 부분'에 대해서 다른 스타일을 적용 가능하게 하도록 함. 
        CSS3 이후 pseudo-class는 :(single colon), pseudo-element는 ::(double colon)으로 구분하려고 시도하는 중이라고 함.
* 어떤 박스가 `position: absolute;`인 속성을 갖는다면, 그 위치의 기준점은 어디가 되나요?
  * 왼쪽 위를 (0,0)으로 오른쪽으로 갈수록 x값이 +, 아래로 갈 수록 y값이 +
  * 해당 box의 부모를 탐색하면서 position이 지정되어 있는 box가 있는지 확인
    * 지정이 되어 있는 ancestor box가 나타나면 그 박스의 왼쪽 위 모서리가 0,0
    * 지정이 되어 있는 ancestor box가 없다면 원래 브라우저의 왼쪽 위 모서리가 0,0
* 가로나 세로로 여러 개의 박스가 공간을 채우되, 그 중 한 개의 박스만 가변적인 크기를 가지고 나머지 박스는 고정된 크기를 갖게 하려면 어떻게 해야 할까요?
  * 가변인 박스만 float없이 나머지 요소들에 대해서 float값과 width를 준다
  * 모든 박스를 inline element 혹은 `display:inline-block`으로 주고, 나머지 박스는 고정 크기를, 너비를 가변적으로 주고 싶은 박스만 %로 width를 준다
  * flex box 안에 나란히 둘 child 요소들을 넣고, 가변으로 폭을 줄 박스에만 flex-grow 값을 준다.
  * 가변으로 주고 싶은 box만 `position: absolute`를 주고, `top, bottom, left, right` 를 설정해 준다.
* `float` 속성은 왜 좋지 않을까요?
  * block formatting / inline formatting: 해당 요소가 [block element](https://www.w3.org/TR/CSS2/visuren.html#block-level)인지, [inline element](https://www.w3.org/TR/CSS2/visuren.html#inline-level)인지에 따라 layout이 배열됨(참조: [normal flow](https://www.w3.org/TR/CSS2/visuren.html#normal-flow))
    * cf) [layout model](https://developer.mozilla.org/en-US/docs/Web/CSS/Layout_mode): block, inline, table, positioned, *flexible*, *grid*
  * float된 요소는 box이더라도 block box들의 레이아웃이 결정되는 normal flow에 포함되지 않기 때문에, float인 box의 parent tag에 바로 붙어있는 텍스트나 내용은 float box가 없는 것 처럼 화면에 그려짐
  * 화면의 크기가 다양하게 달라지는 경우, layout이 깨질 가능성이 높음.
* Flexbox(Flexible box)를 사용할 때의 한계점은 무엇인가요?

## 기타 질문
* `position:absolute` 역시 normal flow에서 벗어나는데 이건 왜 float만큼 욕을 안먹는거지? 안쓰나?
  * 보통은 그래서 normal flow에서 벗어나지 않게 innermost box에서만 쓴다고 한다...
* `<em>`과 `font-style: italic` 처럼 비슷한 기능을 하는 요소가 겹치거나 conflict하는 경우는 없을까?
  * `<em>`은 semantic meaning이고(보여지는 방식은 브라우저가 정하는 것) `font-style: italic`은 의미와 관계 없이 보이는 부분에 대한 치중. 그냥 의미와 치장 요소를 분리하는 거라고 생각하면 더 쉽다.

## Quest
* 아래의 그림들은 모두 전체적으로 창의 크기에 꽉 차야 하며, 창의 크기가 일정 크기 이상일 경우 전체 창 크기가 어떻게 바뀌되더라도 그림에 맞게 각 박스의 크기가 조절되어야 합니다.
* **주의사항**
  * HTML 파일은 수정하면 안됩니다.
  * `float` 속성은 사용하면 안됩니다.
* [이 그림](layout1.png)을 flexbox를 쓰지 않고 구현해 보세요. `skeletons/layout1.html` 파일에 링크된 `skeletons/layout1.css` 파일을 수정하면 됩니다.
* [이 그림](layout2.png)을 flexbox를 쓰지 않고 구현해 보세요. `skeletons/layout2.html` 파일에 링크된 `skeletons/layout2.css` 파일을 수정하면 됩니다.
* [이 그림](layout3.png)을 flexbox를 쓰지 않고 구현해 보세요. `skeletons/layout3.html` 파일에 링크된 `skeletons/layout3.css` 파일을 수정하면 됩니다.
  * layout3에서 block/inline element가 화면을 가득 채우게 할 수 있을까?
    * 할 수 있다. `position: absolute` 와 `top, bottom, left, right` 모두를 설정하는 방식으로...
* 위와 같은 그림을 flexbox를 써서 구현해 보세요. `skeletons/layout4.html` 파일에 링크된 `skeletons/layout4.css` 파일을 수정하면 됩니다.
  

