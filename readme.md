# SMS Bomb 

> 短信轰炸

这是一个恶作剧项目, 目的是给"朋友"发送短信.

比如亲切地问候骗我钱的闲鱼卖家.

一次进行十余个网站的验证码发送.

仅供娱乐. 

## 使用

### Config

创建一个`.env`

```
TARGET_TEL_NUM=13XXXXXXXXX  
```


### 安装依赖

```
npm i
npx playwright install chromium
```

## 测试一下

改成自己的手机号, 运行一个 case 试一试

```
npx playwright test tests/chromium.spec.js -g "百度"
```

## 运行所有

```
npx playwright test
```