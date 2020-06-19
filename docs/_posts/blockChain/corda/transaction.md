# transaction

交易是原子的.

两种类型:

- 公证员变更交易
- 普通交易

## 交易链

创建一个新的交易需要以下输入

- 创建输入的事务的hash
- 上次交易的输出中的输入索引

每个必需的签名者仅应在满足以下两个条件的情况下签名交易：

- **交易有效性**：对于建议的交易以及创建当前建议的交易输入的交易链中的每个交易：
  - 交易由所有必要方进行数字签名
  - 该交易具有*合同效力*（请参见 [合同](https://docs.corda.net/docs/corda-os/4.4/key-concepts-contracts.html)）
- **交易唯一性**：没有其他已承诺交易消耗了我们提议的交易的任何输入（请参阅 [共识](https://docs.corda.net/docs/corda-os/4.4/key-concepts-consensus.html)）