# 实用工具

## curl

```shell
curl http://192.168.100.76:8002/api/artItem/startFlow  -X POST -H "Content-Type:application/json" -d '{"dataKey": "dataKey","metaData": "metaData"}'


curl http://***.***.**.**/api/api -X POST -d "parameterName1=parameterValue1&parameterName2=parameterValue2"
```

## echo

输出

echo -e 转义字符功能

echo -E 关闭转义字符功能

## ntpdate 

时间管理

yum install ntpdate -y 

ntpdate -u ntp.api.bz 

ntp.ntsc.ac.cn

同步网络时间(上海)