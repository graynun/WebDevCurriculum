# Quest 09. What is server


## Introduction
* 이번 퀘스트에서는 인터넷이 어떻게 동작하며, 서버와 클라이언트, 웹 브라우저 등의 역할은 무엇인지 알아보겠습니다.

## Topics
* 서버와 클라이언트, 그리고 웹 브라우저
* 인터넷을 구성하는 여러 가지 프로토콜
  * IP
  * TCP
  * HTTP
* DNS

## Resources
* [OSI 모형](https://ko.wikipedia.org/wiki/OSI_%EB%AA%A8%ED%98%95)
* [IP](https://ko.wikipedia.org/wiki/%EC%9D%B8%ED%84%B0%EB%84%B7_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)
  * [Traceroute from around the world](http://tracert.com/traceroute)
* [TCP](https://ko.wikipedia.org/wiki/%EC%A0%84%EC%86%A1_%EC%A0%9C%EC%96%B4_%ED%94%84%EB%A1%9C%ED%86%A0%EC%BD%9C)
  * [Wireshark](https://www.wireshark.org/download.html)
* [HTTP](https://ko.wikipedia.org/wiki/HTTP)
  * Chrome developer tool, Network tab
* [DNS](https://ko.wikipedia.org/wiki/%EB%8F%84%EB%A9%94%EC%9D%B8_%EB%84%A4%EC%9E%84_%EC%8B%9C%EC%8A%A4%ED%85%9C)
  * [Web-based Dig](http://networking.ringofsaturn.com/Tools/dig.php)

## Checklist
* 인터넷은 어떻게 동작하나요? OSI 7 Layer에 입각하여 설명해 보세요.
  * 보내는사람
    * Application layer: 브라우저에서 www.google.com을 칩니다
    * Presentation layer: Application layer에서 넘어온 데이터의 형식이나 암호화 등에 대한 정보를 처리
    * Session layer: 통신을 하기 위한 session을 만들고 없애줌
    * Transport layer: 어떤 protocol을 쓰는지, 한 번에 얼만큼 많은 정보들을 전달하는지, 전달된 정보가 몇 번째 정보인지 등이 포함된 segment 가 생성된다.
    * Network layer: IP address를 통해서 실제로 전해지는 정보를 누가 받아야 하는지, layer4에서 어떤 protocol을 쓰는지 등이 포함된 packet이 만들어진다
    * Data-link layer: 논리적 주소(IP address)를 물리적 주소로 바꾸어주고 해당 정보를 포함하여 Frame으로 만듬
    * Physical layer: Frame전송!
* 우리가 브라우저의 주소 창에 www.knowre.com 을 쳤을 때, 어떤 과정을 통해 노리의 서버 주소를 알게 되나요?

## Quest
* tracert(Windows가 아닌 경우 traceroute) 명령을 통해 www.google.com까지 가는 경로를 찾아 보세요.
  * 어떤 IP주소들이 있나요?
  * 그 IP주소들은 어디에 위치해 있나요?
~~~~
$ traceroute www.google.com
traceroute to www.google.com (216.58.197.164), 64 hops max, 52 byte packets
 1  10.210.1.1 (10.210.1.1)  2.030 ms  1.640 ms  1.527 ms
 [2  175.209.146.254 (175.209.146.254)  9.721 ms  43.620 ms  154.911 ms](http://geoiplookup.net/ip/175.209.146.254)
 [3  221.148.70.29 (221.148.70.29)  8.259 ms  7.976 ms  8.293 ms](http://geoiplookup.net/ip/221.148.70.29)
 4  61.78.42.168 (61.78.42.168)  6.654 ms  7.522 ms  6.539 ms
 5  112.189.29.41 (112.189.29.41)  182.829 ms  7.684 ms
    112.189.29.125 (112.189.29.125)  7.011 ms
 6  112.174.17.241 (112.174.17.241)  8.872 ms
    112.174.57.253 (112.174.57.253)  122.494 ms
    112.174.103.217 (112.174.103.217)  10.725 ms
 7  112.174.8.2 (112.174.8.2)  6.866 ms
    112.174.8.206 (112.174.8.206)  7.136 ms
    112.174.48.46 (112.174.48.46)  7.459 ms
 8  112.174.83.58 (112.174.83.58)  6.868 ms
    112.174.84.22 (112.174.84.22)  8.742 ms  7.015 ms
======여기서부터 미국(구글)=====
 [9  72.14.194.194 (72.14.194.194)  147.416 ms  37.354 ms  136.397 ms](http://geoiplookup.net/ip/72.14.194.194)
10  216.239.49.17 (216.239.49.17)  129.596 ms
    216.239.48.51 (216.239.48.51)  36.442 ms
    216.239.49.17 (216.239.49.17)  171.615 ms
11  216.239.62.27 (216.239.62.27)  174.258 ms
    216.239.62.29 (216.239.62.29)  37.585 ms  36.336 ms
12  nrt12s02-in-f4.1e100.net (216.58.197.164)  46.459 ms  41.621 ms  41.444 ms
~~~~

* Wireshark를 통해 www.google.com으로 요청을 날렸을 떄 어떤 TCP 패킷이 오가는지 확인해 보세요
  * TCP 패킷을 주고받는 과정은 어떻게 되나요?
  * 각각의 패킷에 어떤 정보들이 담겨 있나요?
* telnet 명령을 통해 http://www.google.com/ URL에 HTTP 요청을 날려 보세요.
  * 어떤 헤더들이 있나요?
  * 그 헤더들은 어떤 역할을 하나요?
