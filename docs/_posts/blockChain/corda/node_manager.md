# 节点

## 节点结构

``` 
├── additional-node-infos   // Additional node infos to load into the network map cache, beyond what the network map server provides
├── artemis                 // Stores buffered P2P messages
├── brokers                 // Stores buffered RPC messages
├── certificates            // The node's certificates
├── corda-webserver.jar     // The built-in node webserver (DEPRECATED)
├── corda.jar               // The core Corda libraries (This is the actual Corda node implementation)
├── cordapps                // The CorDapp JARs installed on the node
├── drivers                 // Contains a Jolokia driver used to export JMX metrics, the node loads any additional JAR files from this directory at startup.
├── logs                    // The node's logs
├── network-parameters      // The network parameters automatically downloaded from the network map server
├── node.conf               // The node's configuration files
├── persistence.mv.db       // The node's database
└── shell-commands          // Custom shell commands defined by the node owner
```

## 证书管理