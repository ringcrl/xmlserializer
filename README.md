# XMLSerializer

将一个真正的 DOM 对象或者 DOM-like 对象（Node DOMParse）序列化

# 说明

- fock 自 <https://github.com/cburgmer/xmlserializer>
- 使用 ES6 Class 实现
- 使用 Jest 进行单元测试

# Demo

不要在生产环境使用，用于个人学习

```js
const XMLSerializerCustom = require('./index.js');
const xmlSerializer = new XMLSerializerCustom();
const parser = new DOMParse(); // 可以是 Browser 环境也可以是 NodeJS 环境
const dom = parser.parseFromString('<p Class="myClass"> </p>', 'text/xml');
xmlSerializer.serializeToString(dom);
```