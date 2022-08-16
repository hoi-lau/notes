---
title: WebSocket - Framing Protocol
date: 2021-06-10
categories:
 - network
tags:
 - websocket
publish: false
---

**websocket协议**

<a href="https://developer.mozilla.org/en-US/docs/Web/API/WebSocket" target="_blank">mdn上的解释</a>

<a href="https://datatracker.ietf.org/doc/html/rfc6455#section-1.2" target="_blank">websocket协议(RFC6455)</a>

参考: https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers

## overview

在websocket协议中, 数据分成多帧传输.

基本帧协议定义了一个带有操作码的帧类型，一个有效载荷长度，以及“扩展数据”的指定位置和“应用程序数据”，它们共同定义了“有效载荷数据”。某些位和操作码保留用于未来的扩展协议。

## frame Protocol

    0                   1                   2                   3
    0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
    +-+-+-+-+-------+-+-------------+-------------------------------+
    |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
    |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
    |N|V|V|V|       |S|             |   (if payload len==126/127)   |
    | |1|2|3|       |K|             |                               |
    +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
    |     Extended payload length continued, if payload len == 127  |
    + - - - - - - - - - - - - - - - +-------------------------------+
    |                               |Masking-key, if MASK set to 1  |
    +-------------------------------+-------------------------------+
    | Masking-key (continued)       |          Payload Data         |
    +-------------------------------- - - - - - - - - - - - - - - - +
    :                     Payload Data continued ...                :
    + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
    |                     Payload Data continued ...                |
    +---------------------------------------------------------------+

- FIN: 1bit. 1代表这是最后一帧

- RSV1, RSV2, RSV3: 1bit. 通常是0, 除非约定了扩展(**Sec-WebSocket-Extensions**)

- opcode: 4bit. opcode 的值决定了应该如何解析后续的数据载荷（data payload）

  根据 opcode 我们可以大致将数据帧分成两大类：数据帧 和 控制帧。

  **数据帧**：目前只有 3 种，对应的 opcode 是：

  - 0x0：数据延续帧
  - 0x1：utf-8文本
  - 0x2：二进制数据
  - 0x3 - 0x7：保留, 用于后续定义的非控制帧

  **控制帧：**

  - 0x8：表示连接断开
  - 0x9：表示 ping 操作, 心跳检查
  - 0xA：表示 pong 操作, 心跳检查
  - 0xB - 0xF：保留, 用于后续定义的控制帧

- mask: 1bit.  为避免混淆网络中介（如拦截代理）和出于安全原因，客户端发送给服务器必须加密帧(mask=1). 服务器发送给客户端的帧不应加密(mask=0), 否则客户端会关闭连接. 

- Payload len: 7bit. 如果payload data长度小于126, Payload len表示数据长度. 如果等于126, Extended payload length(16bit)表示数据长度.如果等于127, Extended payload length(64bit)表示数据长度.

- Masking-key: mask = 1时, 32bit. mask = 0, 0bit.

## frame编码解码

nodejs实现基础的编码解码: 

```js
const http = require('http')
const crypto = require('crypto')
const magicKey = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
function getSecWsAccept(secWebsocketKey) {
  return crypto
    .createHash('sha1')
    .update(`${secWebsocketKey}${magicKey}`)
    .digest('base64')
}

// HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('okay')
})
// 0                   1                   2                   3
//  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
// +-+-+-+-+-------+-+-------------+-------------------------------+
// |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
// |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
// |N|V|V|V|       |S|             |   (if payload len==126/127)   |
// | |1|2|3|       |K|             |                               |
// +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
// |     Extended payload length continued, if payload len == 127  |
// + - - - - - - - - - - - - - - - +-------------------------------+
// |                               |Masking-key, if MASK set to 1  |
// +-------------------------------+-------------------------------+
// | Masking-key (continued)       |          Payload Data         |
// +-------------------------------- - - - - - - - - - - - - - - - +
// :                     Payload Data continued ...                :
// + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
// |                     Payload Data continued ...                |
// +---------------------------------------------------------------+
// 编码
function encodeWsFrame(frame) {
  const byteLen = Buffer.byteLength(frame.data)
  // const byteLen = Buffer.byteLength(frame.data)
  let payloadData = [(frame.FIN << 7) + frame.opcode]
  if (byteLen >= 126) {
    let buf
    // 65536 = 2**16
    // 大于这个数应该用8字节
    if (byteLen >= 65536) {
      buf = Buffer.alloc(8)
      buf.writeBigInt64BE(BigInt(byteLen))
      payloadLen = 127
    } else {
      buf = Buffer.alloc(2)
      buf.writeUInt16BE(byteLen)
      payloadLen = 126
    }
    payloadData.push(payloadLen)
    payloadData.push(...buf)
  } else {
    payloadData.push(byteLen)
  }
  return Buffer.concat([Buffer.from(payloadData), Buffer.from(frame.data)])
}
// 有效的opcode
// *  %x0 denotes a continuation frame
// *  %x1 denotes a text frame 文本
// *  %x2 denotes a binary frame 2进制
// *  %x3-7 are reserved for further non-control frames 保留
// *  %x8 denotes a connection close
// *  %x9 denotes a ping
// *  %xA denotes a pong
// *  %xB-F are reserved for further control frames
// other return ws failed
// 解码
function decodeWsFrame(buf) {
  let offset = 0
  const bits_1 = buf.readUInt8(offset++)
  const bits_2 = buf.readUInt8(offset++)
  const frame = {
    // FIN 当前frame是否结束 1结束
    FIN: (bits_1 & 0b10000000) >> 7,
    // RSV1, RSV2, RSV3 通常为0(除非有扩展)
    RSV1: (bits_1 & 0b01000000) >> 6,
    RSV2: (bits_1 & 0b00100000) >> 5,
    RSV3: (bits_1 & 0b00010000) >> 4,
    // opcode必须是一个有效值
    opcode: bits_1 & 0b00001111,
    // 掩码 如果值为1 则存在masking-key. 客户端send服务端时值一定是 1
    mask: (bits_2 & 0b10000000) >> 7
  }
  let payloadLen = bits_2 & 0b01111111
  // 0 ~ 125 有效载荷长度
  // 126 下2个字节解释为有效载荷长度
  // 127 8个字节
  if (payloadLen === 126) {
    // 网络传输中都是大端序
    payloadLen = buf.readUIntBE(offset, 2)
    offset += 2
  } else if (payloadLen === 127) {
    payloadLen = buf.readBigUInt64BE(offset)
    offset += 8
  }
  // 如果存在掩码, 对数据进行转换
  if (frame.mask === 1) {
    const maskingKey = []
    // 4个字节
    for (let i = 0; i < 4; i++) {
      maskingKey.push(buf.readUInt8(offset++))
    }
    const data = Array.from(payloadLen)
    for (let i = 0; i < payloadLen; i++) {
      // 异或运算
      // https://datatracker.ietf.org/doc/html/rfc6455#section-5.3
      data[i] = buf[offset + i] ^ maskingKey[i % 4]
    }
    frame.data = Buffer.from(data)
  } else {
    frame.data = buf.slice(offset, offset + payloadLen)
  }
  return frame
}

server.on('upgrade', (req, socket, head) => {
  const secWebSocketAccept = getSecWsAccept(req.headers['sec-websocket-key'])
  socket.write(
    'HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
      'Upgrade: WebSocket\r\n' +
      'Connection: Upgrade\r\n' +
      'Sec-WebSocket-Accept: ' +
      secWebSocketAccept +
      '\r\n' +
      '\r\n'
  )
  socket.on('data', (buf) => {
    console.log('---', decodeWsFrame(buf).data.toString())
    socket.write(
      encodeWsFrame({
        FIN: 1,
        opcode: 1,
        data: 'hello websocket!'
      })
    )
  })
})

server.on('error', (error) => {
  console.log('error: ', error)
})

server.listen(80)
```

