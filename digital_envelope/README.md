## 关于 digital_envelope

实现Alice（下简称A）和Bob（下简称B）之间的加密通讯。

运行前请安装依赖
```shell
yarn install
```

执行下面命令生成证书
```shell
yarn run generate
```

启动项目命令如下：

```shell
yarn run startA
yarn run startB
```


在`keys`目录下，JSON格式的文件为可信任第三方签过名的A和B的公钥

我们使用socket.io模块进行双方通信，A与B读取可信任第三方的公钥文件，并向对方发送签过名的公钥，接收到后使用可信任第三方的私钥验证。然后A、B借助对方公钥加密，协商一个对称加密的会话密钥，之后使用AES-256-GCM来进行加密通讯。




我们让A充当服务端，B为客户端。

用到的模块有：

- socket.io（客户端和服务端） 用于服务通讯
- crypto 用于加解密
- fs    用于文件读取