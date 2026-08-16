---
title: "Chrome 浏览器插件"
date: "2020-08-02"
excerpt: "如何找到已安装 Chrome 插件的本地文件、识别插件 ID，并把 .crx 插件打包分享给朋友，一篇图文实战。"
tags:
  - "Chrome"
  - "浏览器"
  - "插件"
---

# Chrom 浏览器插件

## 使用 场景

### 把自己 已装的插件信息发送给朋友

####  怎么找到 自己  谷歌装的插件的位置

1. 在浏览器 里面输入 chrome://version/  

![image.png](/images/blog/yuque-1596083145986-741a8475-011b-40aa-b934-a8.png)

​        一般会保存在 个人资料路径里面


1. 找到  后  出现在 Extensions 里面

![image.png](/images/blog/yuque-1596082989048-29196024-034e-43a1-9f6a-60.png)

1. 点进去之后我们发现一大堆 长串字符串 文件 ， 看不懂， 找不到 咋办 ？ 


![image.png](/images/blog/yuque-1596083112622-c8022402-26a8-493f-b8f0-bc.png)

1. 没事 我们打开自己 的浏览器 找到   更多工具 -> 扩展程序   里面会显示一些我们已经安装过的 插件

![image.png](/images/blog/yuque-1596083355352-dd24fe77-04e5-4786-813c-82.png)

1. 我们点击插件的详细信息

![image.png](/images/blog/yuque-1596083657560-2009a3d1-6521-470c-a1ba-e7.png)

看到没， 这个ID 是不是跟上面的 屎一样长的文件名很像，  对这个ID 就是 文件名了。到此 我们终于找到 对应插件了。开心...


#### 怎么把找到的插件发送给 朋友

我们知道，插件都是.crx 文件，但是我们打开上一步找到的文件我们会发现 

![image.png](/images/blog/yuque-1596083935112-8aaf5978-afd1-4a3e-b8b0-63.png)

版本号 1.33_0

![image.png](/images/blog/yuque-1596083956705-a6024c57-27fa-4a70-990f-a3.png)

里面根本咩有我们想要的 .crx 文件。咋办，不慌不慌...

我们打开之前打开的扩展程序  也就是上面第四步。 更多工具 -> 扩展程序


![image.png](/images/blog/yuque-1596084101896-b20f8d86-86d8-4452-90d2-f9.png)

页面顶部会有  这一个操作栏， 我们点击 打包扩展程序，

![image.png](/images/blog/yuque-1596084256528-8ef25843-8086-4e9f-ba71-53.png)

扩展根目录就选择我们刚才插件的根目录, 

比如： C:\MyChromeDevUserData\Default\Extensions\chphlpgkkbolifaimnlloiipkdnihall\1.33_0


私钥 文件可以不填，选择目录后打包扩展程序。 

成功之后 我们就可以在刚才的文件夹下 看到我们 魂牵梦萦的 .crx 文件了

![image.png](/images/blog/yuque-1596084384225-0cd4286f-f15f-425d-bff7-95.png)

你以为事情结束了，天真...

当然 在  之前版本之前确实 是已经结束了，我们只需要 把 . crx 文件  拖到  浏览器中  就可以了。


我们还需要最后一步 

 把 .crx 文件 后缀改为 rar 文件，然后 把 rar 文件解压，解压之后 ，在把解压文件 拖入 浏览器 就可以啦。