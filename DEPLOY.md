# 🚀 部署指南 - 让朋友也能访问

## 方案一：Vercel（推荐 ⭐⭐⭐⭐⭐）

**优点**：一键部署、自动构建、免费 HTTPS、全球 CDN

### 步骤：

1. **上传代码到 GitHub**
   ```bash
   # 在终端执行以下命令
   git commit -m "initial commit"
   git remote add origin https://github.com/你的用户名/仓库名.git
   git push -u origin main
   ```

2. **访问 Vercel**
   - 打开 https://vercel.com
   - 用 GitHub 账号登录
   - 点击 "Add New Project"
   - 选择你的仓库
   - 点击 "Deploy"

3. **完成！**
   - Vercel 会自动构建并生成一个链接
   - 格式：`https://你的项目名.vercel.app`
   - 分享给朋友即可访问

---

## 方案二：Netlify（推荐 ⭐⭐⭐⭐⭐）

**优点**：拖拽部署、免费 HTTPS、简单易用

### 方法 A：拖拽部署（最简单）

1. **构建项目**
   ```bash
   npm run build
   ```
   会在 `dist` 文件夹生成静态文件

2. **访问 Netlify Drop**
   - 打开 https://app.netlify.com/drop
   - 把 `dist` 文件夹拖到网页上
   - 完成！会生成一个链接

### 方法 B：GitHub 部署

1. 同 Vercel，推送到 GitHub
2. 访问 https://netlify.com
3. 选择仓库，自动部署

---

## 方案三：Cloudflare Pages（推荐 ⭐⭐⭐⭐）

**优点**：免费、速度快、无限流量

### 步骤：

1. 推送到 GitHub（同 Vercel）
2. 访问 https://pages.cloudflare.com
3. 连接 GitHub 账户
4. 选择仓库
5. 构建设置：
   - Build command: `npm run build`
   - Build output directory: `dist`
6. 点击 "Deploy"

---

## 方案四：GitHub Pages（完全免费 ⭐⭐⭐）

**优点**：无需第三方服务、完全免费

### 步骤：

1. **推送到 GitHub**（同上）

2. **使用 GitHub Actions 自动部署**
   
   创建文件 `.github/workflows/deploy.yml`：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
             node-version: 18
         - run: npm install
         - run: npm run build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

3. **启用 GitHub Pages**
   - 仓库 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 保存

4. **访问链接**
   - `https://你的用户名.github.io/仓库名/`

---

## 方案五：本地临时分享（测试用）

### 使用 ngrok

1. **安装 ngrok**
   ```bash
   # macOS
   brew install ngrok
   
   # 或访问 https://ngrok.com 下载
   ```

2. **启动本地服务器**
   ```bash
   npm run dev
   ```

3. **启动 ngrok**
   ```bash
   ngrok http 5173
   ```

4. **分享链接**
   - ngrok 会生成一个临时链接
   - 格式：`https://xxx.ngrok.io`
   - 朋友可以访问，但你电脑关机就失效

---

## 📋 快速对比

| 方案 | 难度 | 持久性 | 速度 | 推荐度 |
|------|------|--------|------|--------|
| Vercel | ⭐ | 永久 | 快 | ⭐⭐⭐⭐⭐ |
| Netlify | ⭐ | 永久 | 快 | ⭐⭐⭐⭐⭐ |
| Cloudflare Pages | ⭐⭐ | 永久 | 很快 | ⭐⭐⭐⭐ |
| GitHub Pages | ⭐⭐⭐ | 永久 | 中 | ⭐⭐⭐ |
| ngrok | ⭐ | 临时 | 慢 | ⭐⭐ |

---

## ⚠️ 重要提示

1. **数据持久化**
   - 当前版本**不保存数据到服务器**
   - 刷新页面后数据会丢失
   - 每次访问都是新的 60 次抽奖机会

2. **如果想保存进度**（未来改进）
   - 可以使用 localStorage（本地保存）
   - 或添加后端数据库（需要服务器）

3. **自定义域名**
   - Vercel/Netlify 都支持绑定自定义域名
   - 免费 SSL 证书

---

## 🎯 推荐流程

**最快部署（5 分钟）：**

```bash
# 1. 提交到 GitHub
git add .
git commit -m "initial commit"
git remote add origin https://github.com/你的用户名/golden-spatula-gacha.git
git push -u origin main

# 2. 访问 Vercel
# https://vercel.com/new
# 选择仓库 → Deploy

# 3. 完成！分享链接给朋友
```

**本地临时测试（1 分钟）：**

```bash
# 1. 构建
npm run build

# 2. 使用任意静态文件服务器
npx serve dist

# 或使用 ngrok 分享
ngrok http 3000
```
