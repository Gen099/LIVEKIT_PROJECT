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

SocksCap64 gets access through SOCKS4 and SOCKS5 proxies for almost every application. You don��t have to maintain any options in the program you want to work via proxy �C SocksCap does everything itself.

keywords: bypass firewall, sockscap64, SocksCap 64 bit, SocksCap x64, Socks5 Proxy, Socks Tunnel

Taro labs is a laboratory founded by taro to develop free SOCKS tunnel software.

official website: http://www.sockscap64.com

��Ό�SocksCap64���ϵ����ܛ����ȥ?(ͨ�^Socket����SocksCap64ܛ����һЩ�О�?)

���e��Ҫ��ĳЩϣ����SocksCap64(���º��QSC64)���ϵ��Լ�ܛ����ȥ���_�l�߶��O��.

SC64�ṩ��һ�����ص�NS��������, ͬ�r����̎���Ñ��l��һЩ�����О�, �˷���ͨ���O ��29810�˿�, ��ĳЩ��r��Ҳ������(����˶˿�����ǰ��ռ��). ���׵��������ҵ�SC64�İ��bĿ��µ�config\ns.ini�ļ�, �Y߅ӛ��ˮ�ǰSC64��NS�������ڹ����Ķ˿�, ����:
[basic]
ip=127.0.0.1
port=29810
searchport=1

port���Ǯ�ǰ�����˿�. ��߅�����_���_�l���̼����f��.

1, ���_ע�Ա�HKEY_CURRENT_USER\Software\Sockscap64
    Install_Dir �ָ����SC64��ǰ�İ��bĿ�.

2, �xȡInstall_Dir\config\ns.ini�ļ�. �@��SC64��ǰNS�������Ă��˿�.

3, ����Socket���2����ȡ�õ��Ķ˿ڰl�Ϳ���ָ��. ���P����ָ���������f��.
    �cnsͨ�ŵĔ�������ʽ��(ns�Ļ��}��ϢҲ���@�ӵĸ�ʽ): cmd (1 bytes) + length of packet body(4 bytes) + packet body
    length of packet bodyָpacket body�L��.
    packet body�ǲ��á�\r\n�������Ķ����ı�������Utf8���a, ��0x00����( ����ָ��ʱ��ؽ�0x00���������͹���)�� 
    ns��ָ����}�е�packet bodyҲ��"\r\n"�ָ��Ķ����ı�, �H2��, ��һ�����e�`�a, 0��ʾ�ɹ�, 1��ʾһ�����e�`,����ֵ����w���e�`���a.

    a) ��ʾ/����SC64������
       cmd: 9
       line 1: on: �@ʾ�����w. off: �[�������w.

    b) ���õ�ǰ����
       cmd: 10
       Line 1	�����������ַ���� 1.2.3.4
       Line 2	����������˿ڣ���1080
       Line 3	�˺ţ��������Ϊ�����ʾ����Ҫ�˺�
       Line 4	���룬�������Ϊ�����ʾ����Ҫ����
       Line 5	3��HTTP,4��ʾ��socks4/4a,5��ʾ��socks5��6��Shadowsocks
       Line 6	���ܷ�ʽ,ֻ����ss������, ��ѡ��ֵ��: aes-256-cfb, aes-192-cfb,aes-128-cfb,rc4-md5,rc4,salsa20,chacha20

     c) ����/���ô����� ( ��: SC64�е��R�r����SC64�Ĺ���)
       cmd: 11
       line 1: on�����ô����ܣ�off�����ô�����

     d) ����Ӧ�ó���      
       cmd: 12
       Line 1	����������
       Line 2	����Ŀ¼
       Line 3	��������

     e)	�̽��( SC64��ǰ�Ƿ����ڹ�����, �Ƿ����o푑�)
       cmd: 13
       �opacket body, length of packet body�o0����.

     f)	���ô������
       ��һ��	����ָ��
       set:  ���ô������
       clear: ������д�����򡡣�����ָ��ֻ��һ�С���

       �ڶ���	Ŀ��Hosts����. ���������:
       һ��IP��ַ, ��: 127.0.0.1
       һ��IP��,��: 192.168.1.1-192.168.1.100
       ���Ϊ*�����ʾƥ������.
       �����Ƕ��IP���߶��IP��, ��;(�ֺ�)����. ����:
       192.168.1.1;10.0.0.1;139.12.10.1-139.12.10.100

       ������	Ŀ��PORTS����, ���������:
       һ���˿�,��: 1080
       һ���˿ڶ�, ��: 8000-8010
       ���Ϊ*�����ʾƥ������.

       ������	������Ϊ
       proxy:  ͨ��������������
       direct: ֱ��
       block: ��ֹ��������
	   
	   ע��:  ip �� port �� AND �Ĺ�ϵ. ����:  ͬʱָ���� IPΪ: 192.168.1.1 �˿�Ϊ: 80 ���ʾƥ�䵽192.168.1.1:80�ķ��ʲ�ִ�й���.

       ע��: ���������úù���, ������Ŀ�����. Ŀ�������������;�ı���򲻻�ʵ����Ч. 

       ���, �����Ҫ����Ϊ������ĳЩIPͨ������, ����IP����ͨ����������Ļ�,���Է���ָ������ ( �����н�����133.155.1.10-133.155.1.15 ͨ�������������� , �������������ֱ�� ):
       clear
       add\r\n*\r\n*\r\ndirect
       add\r\n133.155.1.10-133.155.1.15\r\n*\r\nproxy
	 g) �˳�����
	   �opacket body. Ҳ�����л��}. SC64�յ���ָ��ֱ���˳�.
