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
    * Session layer: 소프트 웨어 사이에서 대화(통신)을 하기 위한 session을 관리(만들기/없애기)
    * Transport layer: 어떤 protocol을 쓰는지, 한 번에 얼만큼 많은 정보들을 전달하는지, 전달된 정보가 몇 번째 정보인지 등이 포함된 segment 가 생성된다.
    * Network layer: 발신/수신자의 IP주소, 해당 패킷의 TTL, L4의 protocol 정보 등이 포함된 packet이 만들어진다
    * Data-link layer: 해당 packet이 가야하는 물리적 주소, L3에서 사용된 protocol정보를 포함한 Frame으로 만듬
    * Physical layer: Frame전송! 실제 구리선 / optical fiber등을 타고 정보 전달. 전달시에는 회선을 공유하는 다른 host들과 충돌이 나지 않도록 전송 순서 / 타이밍 등을 결정하는 규칙이 정해져 있다(Ethernet: CSMA/CD, Wi-fi: CSMA/CA).
* 우리가 브라우저의 주소 창에 www.knowre.com 을 쳤을 때, 어떤 과정을 통해 노리의 서버 주소를 알게 되나요?
  * Recursive Query
  * 내 브라우저 
    => 내 컴퓨터 
    => router(Router 안에 DNS가 있는 경우 여기서 멈출수도) 
    => Local DNS(과거에 방문한 적이 있으면 여기서 멈출수도)
    => Root DNS
    => top-level DNS
    => second-level DNS(ex: *.knowre.com)
  * 서버가 단 하나의 IP주소를 가진 경우에는 누가 언제 물어봐도 DNS가 동일한 IP주소를 이야기해주지만, CDN으로 구성된 서버의 경우 조금 달라짐.
  * CDN으로 구성된 경우 Local DNS나 second-level DNS에서 규칙에 알맞은(예: 거리가 가깝거나(network상에서 hop수가 적은 서버), 운영비용이 더 싸거나, 트래픽이 더 적게 몰려있거나) 서버의 IP주소를 알려줌. [참고](https://www.nczonline.net/blog/2011/11/29/how-content-delivery-networks-cdns-work/)

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
    * client => Google server: GET / HTTP/1.1
    * Google server => client: HTTP/1.1 302 Found(text/html)
    * client => Google server: GET /?gfe_rd=cr&ei=8_2GV4zYLO798weXwYTYAQ HTTP/1.1\r\n]
    * Google server => client: HTTP/1.1 302 Found(text/html)
  * 각각의 패킷에 어떤 정보들이 담겨 있나요?
    * Frame 헤더 정보: number, length, arrival time, protocols in frame
    * Ethernet 헤더 정보: Source(내 맥북의 MAC address), destination(local router MAC address) L3 protocol 정보(IPv4)
    * IPv4 헤더 정보: Source(내 맥북 IP), destination(Google server IP), L4 protocol(TCP), TTL, 전체 길이, header checksum 등등...
    * TCP 헤더 정보: Source port, destination port, sequence number, window size, checksum 등등 
    * HTTP 헤더 정보:
      * client to server packet: Host, connection, user-agent, accept, date, etc
      * Server to client packet: cache-control, content-type, location, date, etc.
* telnet 명령을 통해 http://www.google.com/ URL에 HTTP 요청을 날려 보세요.
  * 어떤 헤더들이 있나요?
  * 그 헤더들은 어떤 역할을 하나요?
  * 아래는 wireshark의 http 헤더 정보를 긁어왔습니다(telnet 에서 get request가 작동하지 않음)
~~~~
Host: www.google.com\r\n
Connection: keep-alive\r\n
Upgrade-Insecure-Requests: 1\r\n
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36\r\n
X-Client-Data: CJO2yQEIprbJAQjAtskBCJOXygEI8pzKAQ==\r\n
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n
Accept-Encoding: gzip, deflate, sdch\r\n
Accept-Language: en-US,en;q=0.8,ko;q=0.6\r\n
~~~~