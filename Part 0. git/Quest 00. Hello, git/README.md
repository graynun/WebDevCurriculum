# Quest 00. Hello, git


## Introduction
* git은 2016년 현재 개발 생태계에서 가장 각광받고 있는 버전 관리 시스템입니다. 이번 퀘스트를 통해 git의 기초적인 사용법을 알아볼 예정입니다.

## Topics
* git
  * `git clone`
  * `git add`
  * `git commit`
  * `git push`
  * `git pull`
  * `git branch`
  * `git stash`
* GitHub

## Resources
* [git, 분산 버전 관리 시스템](http://www.yes24.com/24/goods/3676100?scode=032&OzSrank=1), 인사이트
* [GitHub 사용 설명서](http://www.yes24.com/24/Goods/17638082?Acode=101), 교학사
* https://try.github.io
* http://pcottle.github.io/learnGitBranching

## Checklist
* 버전 관리 시스템은 왜 필요한가요?
	* 대부분의 소프트웨어는 앉은자리에서 한 번에 짜는 것이 아니라 구조를 만들고, 그것을 구성하는 작은 단위들을 만들거나 수정하는 방식으로 만들어지는데 이 변경사항에 대해서 효율적으로 저장 / 잘못되는 경우 되돌리기가 가능해야됨 / 여러사람이 일하는 경우 같은 것을 기반으로 개개인이 작업하는 부분이 다른 부분과 잘 호환되게 해야 할 수도 있음 / 여러 사람이 같은 부분을 다시 만드는 일도 없어야 됨 등등의 이유로...
* git 외의 버전관리 시스템에는 무엇이 있나요? git은 그 시스템과 어떤 점이 다르며, 어떤 장점을 가지고 있나요?
	* Central vs Distributed: 중앙의 서버에 하나의 '진리'인 code base가 있는가 vs 분산형으로 각각의 작업자에 동일한 내역을 보관하고 있는가(SVN, Perforce / git, Mercury)
	* 변경 내역 저장 방식: Snapshot vs delta
* git의 `clone`/`add`/`commit`/`push`/`pull`/`branch`/`stash` 명령은 무엇이며 어떨 때 이용하나요? 그리고 어떻게 사용하나요?
	* clone: (Remote) repository를 복사할 때
	* add: 작업한 내역(특정 파일 혹은 파일 전체, working space)을 local git의 index에 내용 추가하기
	* commit: index에 있는 내용을 git HEAD(현재 branch)에 추가하기. 작업 내용에 대한 간단한 설명도 붙인다.
	* push: local git에 추가된 commit을 remote repository에 저장하기
	* pull: remote repository에 있는 내용을 받아오기
	* branch: 새로운 branch 만들기
	* stash: 특정 branch에서 작업한 내용을 commit하지 않고(하지만 작업내용도 잃지 않고) branch를 바꾸고 싶을 때 작업 내용을 임시로 저장. 하기 전에 add는 해줘야 한다.

## Quest
* github에 가입한 뒤, [이 커리큘럼의 github 저장소](https://github.com/KnowRe/WebDevCurriculum)의 우상단의 Fork 버튼을 눌러 자신의 저장소에 복사해 둡니다.
* [GitHub Desktop](https://desktop.github.com/)을 다운받아 설치합니다.
* Windows의 경우 같이 설치된 git shell을, MacOSX의 경우 터미널을 실행시켜 커맨드라인에 들어간 뒤, 명령어를 이용하여 복사한 저장소를 clone합니다.
  * 앞으로의 git 작업은 되도록 커맨드라인을 통해 하는 것을 권장합니다.
* 이 문서가 있는 폴더 바로 밑에 있는 sandbox 폴더에 파일을 추가한 후 커밋해 보기도 하고, 파일을 삭제해 보기도 하고, 수정해 보기도 하면서 각각의 단계에서 커밋했을 때 어떤 것들이 저장되는지를 확인합니다.
* `clone`/`add`/`commit`/`push`/`pull`/`branch`/`stash` 명령을 충분히 익혔다고 생각되면, 자신의 저장소에 이력을 push합니다.
