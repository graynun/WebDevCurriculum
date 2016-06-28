# Quest 06. JavaScript OOP - Design


## Introduction
* 이번 퀘스트에서는 자바스크립트의 객체지향 프로그래밍에 대해 알아볼 예정입니다.

## Topics
* Prototype
  * `Foo.prototype = ...`
* 생성자
  * 멤버 함수
  * 멤버 변수
* 상속

## Resources
* [자바스크립트 완벽 가이드](http://www.yes24.com/24/Goods/8275120?Acode=101), 인사이트
* [자바스크립트 객체지향 프로그래밍](http://www.yes24.com/24/Goods/7276246?Acode=101), 위키북스

## Checklist
* 프로토타입 기반의 객체지향 프로그래밍은 무엇일까요?
  * 클래스 기반의 객체지향 프로그래밍과 어떤 점이 다를까요?
  * Prototype-based에서는 object를 만들 때 기존에 있는 object를 clone하는 방식이라면 Class-based의 경우 instantiation으로 만들어야 한다(이 과정에서 format interpretation이 일어난다고)
  * Class의 경우 static type checking을 하는 경우 compile시에 type checking이 일어나므로 프로그램 돌리는동안(during runtime) 클래스의 변경이 어렵지만 prototype(object)의 경우 type checking이 runtime일때 일어나므로 더 쉽게 할 수 있다고 한다(근데 이건 static type checking language의 이야기이지 꼭 prototype vs class의 문제는 아닌듯....) 
  * Object-oriented에서 Object는 결국 필요한 data(attribute, member variable, etc.)를 담고 있고, 그걸 읽어오거나 변경하거나 특정 연산을 시키는 operation(method, member function, etc.)으로 구성되어 있는 것 같다.
  * 그럼 이 object를 어떻게 define할 것인가? 이 object를 찍어내는 틀이 class인가? 아니면 prototype인가?에 따라서 크게 달라지는듯.
  * class와 prototype의 가장 큰 차이는 inherit 할때 몽땅 똑같이 해야만 하는 것인가? 가장 많이 일어나는 일은 method를 선택적으로 inherit하거나 추가하는 것 같다. prototype은 상대적으로 쉽게 선택적 inherit / method의 추가가 일어난다. 

* 객체의 프로토타입 함수는 무엇일까요?
  * `DefinedClass.prototype.functionIWant`: 내가 원하는 method를 해당 "클래스"(정확히는 prototype)에 추가하는 방법.

* JavaScript에서 `private`한 멤버 변수를 구현하려면 어떤 식으로 해야 할까요?
  * 처음 class(object?)를 만들때 변수를 var로 선언한다
    * 다른 방법이 있을까?

* 자바스크립트에서 클래스간에 상속을 하려면 어떤 식으로 구현해야 할까요?
  * ES6: `class ChildClass extends ParentClass {...}` - '클래스' 라는 개념이 js에 생겼기 때문에 이런식으로 하게 된것인가?(그냥 자바문법 아닌가?...)
  * 
  ~~~~
  function ChildClass(argument) {
    ParentClass.call(this, argument);
    ...
  }

  ChildClass.prototype = new ParentClass();
  ChidClass.prototype = Object.create(ParentClass.prototype);
  ~~~~



## Quest
* Quest 06 ~ Quest 07 을 통해, 웹 상에서 동작하는 간단한 바탕화면 시스템을 만들 예정입니다.
* 요구사항은 다음과 같습니다:
  * 아이콘은 폴더와 일반 아이콘, 두 가지의 종류가 있습니다.
  * 아이콘들을 드래그를 통해 움직일 수 있어야 합니다.
  * 폴더 아이콘은 더블클릭하면 해당 폴더가 창으로 열리며, 열린 폴더의 창 역시 드래그를 통해 움직일 수 있어야 합니다.
  * 처음에는 세 개의 아이콘이 있으며, 그 중 두 개는 폴더입니다.
* 이번 퀘스트에서는 바탕화면 시스템을 만들기 위한 준비작업을 할 예정입니다.
  * 어떤 클래스들이 필요할지 생각해 보세요.
  * 각 클래스들의 멤버변수와 멤버함수는 어떤 것이 있을지 설계해 보세요.
  * 각 클래스들의 생성자에는 무엇이 들어가야 할지 설계해 보세요.
  * <u>**실제 동작하는 함수를 짤 필요는 없습니다**</u>. 빈 함수로 정의만 해 보세요!
