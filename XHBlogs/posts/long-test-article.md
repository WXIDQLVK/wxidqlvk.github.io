---
title: TrollStore巨魔商店
date: '2026-03-26 07:00:00'
tags:
- 学术
- 深度学习
- GROMACS
mood: ''
cover: trollstore.jpg
description: iOS永久签名工具
---

利用iOS系统CoreTrust安全组件逻辑漏洞（TrollStore1：CVE-2022-26766；TrollStore2：CVE-2023-41991）：

1. CoreTrust是iOS负责校验App签名、判断应用是否合法的核心模块；

2. 漏洞可伪造官方信任证书链，让系统判定第三方IPA为苹果官方合法应用；

3. 所有通过巨魔安装的App获得永久有效签名，无7天时效、不会因证书封禁闪退，完全不受免费Apple ID名额限制。
