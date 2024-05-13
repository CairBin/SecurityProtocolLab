## 关于http_ssl

本项目使用openssl生成自签证书，并基于express框架搭建Web服务

### 使用方式

安装依赖项
```shell
yarn install
```

编辑`config/config.js`来设置服务器参数
```js
{
    server:{
        static: 'asset',        // 静态资源目录

        // http配置
        http:{
            host: "localhost",  // 主机地址或域名
            port: 8848          // 服务运行的端口号
        },

        // https配置
        https:{
            host:'localhost',
            port:8849
        }
    }
}
```

生成证书文件，在使用前需要安装OpenSSL并配置环境变量，windows下请手动执行里面的命令。
```sh
sh generate.sh
```

根据命令行提示填写信息，执行完毕后会发现有`keys`目录以及密钥、证书文件生成。

运行Express项目

```shell
yarn run start
```

启动浏览器访问`http://localhost:8848`，即可见到`Hello World!`页面。
https服务请访问`https://localhost:8849`，但现代浏览器基本都会提示不安全，因为我们使用的证书是自签的。

（访问地址根据配置文件的`host`和`port`字段自行修改）