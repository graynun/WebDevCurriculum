# Quest 17. Playing SVG


## Introduction
* 이번 퀘스트에서는 사각형과 박스 모델 일색인 웹에서 다양한 도형을 그리는 방법을 알아보겠습니다.

## Topics
* 벡터 그래픽
  * SVG 포맷
* 키보드 이벤트
  * `onkeypress`
  * `onkeydown` / `onkeyup`
  * keyCode

## Resources
* [MDN - SVG](https://developer.mozilla.org/ko/docs/Web/SVG)

## Checklist
* SVG 포맷은 JPG, PNG 등의 포맷과 어떤 점이 다른가요?
	* raster image(jpg, png, etc.): 정보가 픽셀 단위로 저장되며, 해상도가 정해져있다. 확대할때 픽셀 자체의 크기가 커지면서 그림이 뭉개짐
	* vector image(svg): 정보가 벡터로 저장되어 있고, 확대/ 축소시 해당 벡터 정보를 이용해 그려지므로 그림이 안뭉개짐
* SVG 포맷은 HTML 포맷과 어떤 점이 다른가요?
	* (X)HTML의 규칙들을 물려받아 더 엄격하게 tag규칙들을 지켜야 하는듯
* 브라우저 상의 키보드 이벤트에서 keyCode는 어떤 역할을 하나요?
	* 사용자가 키보드로 정보를 넣는 경우 어떤 키를 눌렀는지 구분할 수 있게 해줌
	* `keyCode`(해당 키의 ASCII code number return), `charCode` (해당 키의 unicode return)는 standard에서 제거되었다고 하고, `key`(해당 키의 정보를 string으로 return)를 사용하는 것을 권장하는데 `keyCode`는 여전히 대부분의 브라우저에서 지원된

## Quest
* 간단한 스케치보드를 만들어 보려고 합니다.
  * 정해진 크기와 모양의 사각형, 삼각형, 원을 그리는 버튼이 있어야 합니다.
  * 그린 삼각형, 사각형, 원을 이동하고 삭제하는 기능이 있어야 합니다.
    * 키보드의 Arrow 키와 Delete 키를 통해 선택된 도형을 이동하고 삭제할 수 있어야 합니다.
  * 저장 기능은 굳이 구현하지 않아도 됩니다.
