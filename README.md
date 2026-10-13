# 互动实验室

一个由 24 个独立网页组成的浏览器互动实验集，探索摄像头、姿态与手势识别，以及声音和音乐交互。入口页面会按类别展示全部实验。

直接体验风格试衣间：[`https://chenchenliu0315.github.io/link1/play/`](https://chenchenliu0315.github.io/link1/play/)。

## 运行

项目是静态网页，不需要安装 npm 依赖或执行构建。部分实验会从 CDN 加载 TensorFlow.js、识别模型或其他资源，因此首次运行需要网络连接。

在项目根目录启动本地 HTTP 服务：

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

然后在浏览器打开 <http://localhost:8000>，从入口页选择实验。也可以直接打开对应的 `index.html`，但摄像头和麦克风功能需要通过 HTTPS 或 localhost 访问，直接使用 `file://` 可能无法正常工作。

## 实验目录

### 摄像头互动（16）

位于 [`camera/`](./camera/)：

1. [面部特效](./camera/01面部特效/index.html)
2. [体感接球](./camera/02体感接球/index.html)
3. [年龄穿搭挑战](./camera/03手势控制/index.html)
4. [风格迁移](./camera/04风格迁移/index.html)
5. [隔空画笔](./camera/05隔空画笔/index.html)
6. [AR 放置](./camera/06AR放置/index.html)
7. [表情识别](./camera/07表情识别/index.html)
8. [镜像情绪屋](./camera/08镜像情绪屋/index.html)
9. [手势音乐](./camera/09手势音乐/index.html)
10. [粒子肖像](./camera/10粒子肖像/index.html)
11. [隔空拼图](./camera/11隔空拼图/index.html)
12. [AR 涂鸦墙](./camera/12AR涂鸦墙/index.html)
13. [表情翻页书](./camera/13表情翻页书/index.html)
14. [动作舞蹈](./camera/14动作舞蹈/index.html)
15. [视觉暂留](./camera/15视觉暂留/index.html)
16. [手势穿搭推荐](./camera/16每日穿搭/index.html)

### 声音互动（8）

位于 [`sound/`](./sound/)：

1. [鼓点](./sound/01鼓点/index.html)
2. [回声谷](./sound/02回声谷/index.html)
3. [音阶阶梯](./sound/03音阶阶梯/index.html)
4. [粒子声场](./sound/04粒子声场/index.html)
5. [声波画笔](./sound/05声波画笔/index.html)
6. [节拍合成器](./sound/06节拍合成器/index.html)
7. [人声变形](./sound/07人声变形/index.html)
8. [混音台](./sound/08混音台/index.html)

## 使用提示

- 摄像头或麦克风实验首次运行时，按浏览器提示授予相应权限。
- 摄像头识别建议在光线充足、背景简洁的环境中使用；体感实验请按页面提示调整与摄像头的距离。
- 音视频交互数据由网页在浏览器中处理；实验可能会从 CDN 下载脚本或模型文件。
- 如果实验无法启动，请确认使用支持相关 Web API 的现代浏览器、访问地址为 HTTPS 或 localhost，并检查网络连接及权限设置。
