# 🧠 记忆流 MemoryFlow

**说过的话，都帮你记住。**

全平台语音记忆助手，为阿尔茨海默患者和健忘人群设计。支持 33 种语言，色盲友好，关闭即清除。

![License](https://img.shields.io/badge/license-MIT-blue)
![Platform](https://img.shields.io/badge/platform-Web-brightgreen)
![Languages](https://img.shields.io/badge/languages-33-orange)

## 🌐 在线体验

**[https://memoryflow.sj9292008133.workers.dev](https://memoryflow.sj9292008133.workers.dev)**

## ✨ 特性

- **🎙️ 语音转文字** — 选择语言，按下按钮，持续录入
- **🌍 33 种语言** — 中英日韩法德西俄阿等，支持自动识别
- **📱 全平台** — Windows / macOS / Linux / Android / iOS / ChromeOS
- **♿ 色盲友好** — 蓝橙配色，避开红绿；图标+文字+颜色三重提示；WCAG AA 对比度
- **🔒 隐私优先** — 无需注册，关闭标签页自动清除所有内容（sessionStorage）
- **📝 Markdown 导出** — 按时间线生成结构化 Markdown 文档
- **📤 多平台分享** — 系统原生分享 / Gmail / Google 文档 / WhatsApp / Telegram / 微信 / LINE / 邮件
- **🔄 自适应** — 自动检测浏览器能力，双引擎（实时+精确）或纯录音模式无缝降级

## 🏗️ 技术架构

```
┌─────────────────────────────────┐
│        前端 (public/)           │
│  HTML + CSS + JS 单文件         │
│  Web Speech API (实时预览)      │
│  MediaRecorder (录音采集)       │
│  sessionStorage (会话缓存)      │
└──────────┬──────────────────────┘
           │ 音频上传
┌──────────▼──────────────────────┐
│     Cloudflare Worker (src/)    │
│  接收音频 → Workers AI Whisper  │
│  返回转写文本 + 语言 + 时长     │
└─────────────────────────────────┘
```

### 双引擎自适应

| 浏览器 | 模式 | 体验 |
|--------|------|------|
| Chrome / Edge (桌面 & Android) | 双引擎 | 边说边出字 + Whisper 精确转写 |
| Safari (iOS / macOS) | 双引擎 / 录音 | Web Speech + MP4/AAC 录音 |
| Firefox | 纯录音 | 每 10 秒自动转写一段 |
| 微信 / QQ 内置浏览器 | 提示跳转 | 引导用系统浏览器打开 |

## 🚀 部署

### 前置条件

- [Node.js](https://nodejs.org/) 18+
- [Cloudflare 账号](https://dash.cloudflare.com/)（免费即可）
- Wrangler CLI

### 一键部署

```bash
# 1. 克隆仓库
git clone https://github.com/YOUR_USERNAME/memoryflow.git
cd memoryflow

# 2. 安装依赖
npm install

# 3. 登录 Cloudflare
npx wrangler login

# 4. 部署
npm run deploy
```

部署完成后会输出 URL，例如 `https://memoryflow.YOUR_SUBDOMAIN.workers.dev`

### 本地开发

```bash
npm run dev
# 访问 http://localhost:8787
# 注意：本地模式下 Whisper API 不可用，仅 Web Speech API 生效
```

### 绑定自定义域名

在 Cloudflare Dashboard → Workers → memoryflow → Settings → Domains & Routes 中添加你的域名。

## 💰 成本

| 项目 | 免费额度 | 超出费用 |
|------|---------|---------|
| Workers 请求 | 100,000 次/天 | $0.50 / 百万次 |
| Workers AI (Whisper) | ~240 分钟/天 | $0.0005 / 分钟 |
| 总计 | 个人用免费 | — |

## 📁 项目结构

```
memoryflow/
├── public/
│   └── index.html          # 前端（单文件，含 HTML/CSS/JS）
├── src/
│   └── worker.js            # Cloudflare Worker 后端
├── wrangler.jsonc           # Wrangler 配置
├── package.json
└── README.md
```

## 🎨 无障碍设计

- **配色**: 蓝 (#1565C0) + 橙 (#E67700)，对红绿色盲最安全的组合
- **对比度**: 所有文本 ≥ 4.5:1 (WCAG AA)
- **状态提示**: 图标 + 文字 + 颜色三重冗余，不单独依赖颜色
- **字体**: 17px 正文，适合视力下降的用户
- **按钮**: 88px 大圆按钮，防误触
- **操作**: 最少两步完成（选语言 → 按按钮）

## 📄 License

MIT
