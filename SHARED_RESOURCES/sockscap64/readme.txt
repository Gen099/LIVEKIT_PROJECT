Sockscap64 - Makes Programs Support Socks Proxy

64 bit SocksCap, fully support Win XP/ Vista /Win7/ Win8 /Win 8.1/Win10 32 bit & 64 bit system.

SocksCap64 is a freeware developed by Taro that is an easy and a beautiful way to let the programs you want to work through a specific SOCKS proxy server, even if your applications don't have such an option. It allows you to use different proxies for different programs and make a launch list for the applications you wish to have a peculiar connection. SocksCap64 does not require modifications to the Winsock applications or the Winsock stacks.

With SocksCap64 you can work with any Internet client through a network that is separated from the Internet by a firewall (only one open port is required).


Here are some of its benefits:

Makes programs to work through a specific SOCKS proxy server;
Hides your activity and your IP address;
Manages proxies for each application;
Easy, simple, but very useful application;
Support Win XP/Win Vista/Win7/Win8/Win8.1/Win 10 32bit & 64bit system.
Support Socks4/4a/5/http/shadowsocks proxy protocols.
Support TCP/UDP network protocols.
Unlimited proxies.
Disable Temporarily.
100% free to download and 100% free to use.

SocksCap64 gets access through SOCKS4 and SOCKS5 proxies for almost every application. You don’t have to maintain any options in the program you want to work via proxy – SocksCap does everything itself.

keywords: bypass firewall, sockscap64, SocksCap 64 bit, SocksCap x64, Socks5 Proxy, Socks Tunnel

Taro labs is a laboratory founded by taro to develop free SOCKS tunnel software.

official website: http://www.sockscap64.com

如何將SocksCap64整合到你的軟件中去?(通過Socket控制SocksCap64軟件的一些行為?)

此舉主要為某些希望將SocksCap64(以下簡稱SC64)整合到自己軟件中去的開發者而設置.

SC64提供了一個本地的NS解析服務, 同時可以處理用戶發出一些控制行為, 此服務通常監聽在29810端口, 但某些情況下也會更改(例如此端口已提前被占用). 穩妥的做法是找到SC64的安裝目錄下的config\ns.ini文件, 裏邊記錄了當前SC64的NS服務正在工作的端口, 如下:
[basic]
ip=127.0.0.1
port=29810
searchport=1

port即是當前工作端口. 下邊將正確的開發流程加下說明.

1, 打開注冊表HKEY_CURRENT_USER\Software\Sockscap64
    Install_Dir 項指明了SC64當前的安裝目錄.

2, 讀取Install_Dir\config\ns.ini文件. 獲得SC64當前NS工作在哪個端口.

3, 創建Socket向第2步中取得到的端口發送控制指令. 相關控制指令在如下說明.
    與ns通信的數據包格式為(ns的回複信息也是這樣的格式): cmd (1 bytes) + length of packet body(4 bytes) + packet body
    length of packet body指packet body長度.
    packet body是采用“\r\n”区隔的多行文本，采用Utf8編碼, 以0x00结束( 发送指令时务必将0x00结束符发送过来)。 
    ns的指令回複中的packet body也是"\r\n"分隔的多行文本, 僅2行, 第一行是錯誤碼, 0表示成功, 1表示一般性錯誤,其它值為具體的錯誤編碼.

    a) 显示/隐藏SC64主窗口
       cmd: 9
       line 1: on: 顯示主窗體. off: 隱藏主窗體.

    b) 设置当前代理
       cmd: 10
       Line 1	代理服务器地址，如 1.2.3.4
       Line 2	代理服务器端口，如1080
       Line 3	账号，此行如果为空则表示不需要账号
       Line 4	密码，此行如果为空则表示不需要密码
       Line 5	3是HTTP,4表示是socks4/4a,5表示是socks5，6是Shadowsocks
       Line 6	加密方式,只用在ss代理中, 可选的值是: aes-256-cfb, aes-192-cfb,aes-128-cfb,rc4-md5,rc4,salsa20,chacha20

     c) 启用/禁用代理功能 ( 即: SC64中的臨時禁用SC64的功能)
       cmd: 11
       line 1: on：启用代理功能；off：禁用代理功能

     d) 启动应用程序      
       cmd: 12
       Line 1	程序命令行
       Line 2	工作目录
       Line 3	启动参数

     e)	活动探测( SC64當前是否仍在工作中, 是否卡死無響應)
       cmd: 13
       無packet body, length of packet body給0就行.

     f)	设置代理规则
       第一行	代理指令
       set:  设置代理规则
       clear: 清除所有代理规则　（　此指令只需一行　）

       第二行	目标Hosts规则. 规则可以是:
       一个IP地址, 如: 127.0.0.1
       一个IP段,如: 192.168.1.1-192.168.1.100
       如果为*号则表示匹配所有.
       可以是多个IP或者多个IP段, 以;(分号)隔开. 例如:
       192.168.1.1;10.0.0.1;139.12.10.1-139.12.10.100

       第三行	目标PORTS规则, 规则可以是:
       一个端口,如: 1080
       一个端口段, 如: 8000-8010
       如果为*号则表示匹配所有.

       第四行	规则行为
       proxy:  通过代理请求网络
       direct: 直连
       block: 阻止访问网络
	   
	   注意:  ip 与 port 是 AND 的关系. 例如:  同时指定了 IP为: 192.168.1.1 端口为: 80 则表示匹配到192.168.1.1:80的访问才执行规则.

       注意: 必须先设置好规则, 再启动目标程序. 目标程序启动后中途改变规则不会实现生效. 

       因此, 如果需要设置为仅允许某些IP通过代理, 其它IP均不通过代理请求的话,可以发送指令如下 ( 例子中仅允许133.155.1.10-133.155.1.15 通过代理请求网络 , 其它所有请求均直连 ):
       clear
       add\r\n*\r\n*\r\ndirect
       add\r\n133.155.1.10-133.155.1.15\r\n*\r\nproxy
	 g) 退出程序
	   無packet body. 也不會有回複. SC64收到此指令直接退出.
