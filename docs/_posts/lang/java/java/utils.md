# utils

## 16进制转换

```java
/**
 * 字符串转为16进制
 */
public static String str2HexStr(String str) {
     char[] chars = "0123456789ABCDEF".toCharArray();
     StringBuilder sb = new StringBuilder("");
     byte[] bs = str.getBytes();
     int bit;
     for (int i = 0; i < bs.length; i++) {
         bit = (bs[i] & 0x0f0) >> 4;
         sb.append(chars[bit]);
         bit = bs[i] & 0x0f;
         sb.append(chars[bit]);
         // sb.append(' ');
     }
     return sb.toString().trim();
 }
 /**
  * 16进制直接转换成为字符串(无需Unicode解码)
  * @param hexStr
  * @return
  */
 public static String hexStr2Str(String hexStr) {
     String str = "0123456789ABCDEF";
     char[] hexs = hexStr.toCharArray();
     byte[] bytes = new byte[hexStr.length() / 2];
     int n;
     for (int i = 0; i < bytes.length; i++) {
         n = str.indexOf(hexs[2 * i]) * 16;
         n += str.indexOf(hexs[2 * i + 1]);
         bytes[i] = (byte) (n & 0xff);
     }
     return new String(bytes);
 }
```

## [ 数据库连接driverClass和jdbcUrl大全](https://www.cnblogs.com/wayne-ivan/p/3922223.html)

1. mysql.
   
  - driverClass: com.mysql.jdbc.Driver(<8), com.mysql.cj.jdbc.Driver(>=8)
  
  - jdbcurl: jdbc:mysql://db.3dku.me:7880/corda_client?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=Hongkong
2. postgresql
   
  - driverClass：org.postgresql.Driver
  
  - jdbcurl：jdbc:postgresql://127.0.0.1:5432/yourDBName

