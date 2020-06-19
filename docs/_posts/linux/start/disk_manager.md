# disk

## 扩展磁盘空间(lvm管理)

```shell
# 查看磁盘情况
fdisk -l /dev/sda
# 查看磁盘占用
df -fh
# 创建新分区
fdisk /dev/sda
# n p ... 8e w
reboot
# ...
vgdisplay
# VG Name   cl

# 为新分配的空间创建一个新的物理卷
pvcreate /dev/sda3
# 使用新的物理卷来扩展 LVM 的 VolGroup
vgextend cl /dev/sda3
# 扩展 LVM 的逻辑卷 /dev/cl/home
lvextend  /dev/cl/home  /dev/sda3
xfs_growfs /dev/cl/home
df -fh
```

