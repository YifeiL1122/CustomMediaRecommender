# Vercel 部署指南

## 前置条件

1. 注册 Vercel 账号：https://vercel.com
2. 安装 Vercel CLI：`npm i -g vercel`
3. 获取 OMDB API Key：http://www.omdbapi.com/apikey.aspx

## 部署步骤

### 方法一：通过 Vercel 网站（推荐）

1. 在 GitHub 上推送你的代码
2. 访问 https://vercel.com/dashboard
3. 点击 "New Project"
4. 导入你的 GitHub 仓库
5. 在环境变量设置中添加：
   - `OMDB_API_KEY`: 你的 OMDB API 密钥
6. 点击 "Deploy"

### 方法二：通过 CLI

1. 在项目根目录运行：
   ```bash
   vercel
   ```

2. 按照提示完成配置

3. 设置环境变量：
   ```bash
   vercel env add OMDB_API_KEY
   ```

4. 重新部署：
   ```bash
   vercel --prod
   ```

## 环境变量配置

在 Vercel 仪表板中设置以下环境变量：

- `OMDB_API_KEY`: 你的 OMDB API 密钥
- `FLASK_ENV`: production

## 本地测试

在部署前，你可以在本地测试：

1. 创建 `.env` 文件：
   ```
   OMDB_API_KEY=your_api_key_here
   ```

2. 安装依赖：
   ```bash
   pip install -r requirements.txt
   ```

3. 运行应用：
   ```bash
   python app.py
   ```

## 注意事项

- Vercel 免费版有使用限制
- 静态文件会自动处理
- 每次推送到主分支会自动重新部署 