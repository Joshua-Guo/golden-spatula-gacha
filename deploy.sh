#!/bin/bash

# 阿里云 ECS 部署脚本
# 使用方法：./deploy-to-aliyun.sh

SERVER_IP="120.26.32.238"
SERVER_USER="root"
SERVER_PASSWORD="Huayui2114"
LOCAL_DIST="./dist"
REMOTE_PATH="/var/www/html"

echo "🚀 开始部署到阿里云 ECS..."

# 1. 检查 dist 文件夹是否存在
if [ ! -d "$LOCAL_DIST" ]; then
    echo "❌ dist 文件夹不存在，请先执行 npm run build"
    exit 1
fi

echo "✅ dist 文件夹存在"

# 2. 安装 sshpass（如果不存在）
if ! command -v sshpass &> /dev/null; then
    echo "⚠️ 需要安装 sshpass"
    echo "   macOS: brew install hudochenkov/sshpass/sshpass"
    echo "   Linux: apt install sshpass"
    exit 1
fi

# 3. 上传文件
echo "📦 正在上传文件到服务器..."
sshpass -p "$SERVER_PASSWORD" scp -o StrictHostKeyChecking=no -r $LOCAL_DIST/* $SERVER_USER@$SERVER_IP:$REMOTE_PATH/

if [ $? -eq 0 ]; then
    echo "✅ 文件上传成功"
else
    echo "❌ 文件上传失败"
    exit 1
fi

# 4. 配置 Nginx
echo "⚙️  配置 Nginx..."
sshpass -p "$SERVER_PASSWORD" ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP_IP << 'ENDSSH'
# 创建 Nginx 配置文件
cat > /etc/nginx/conf.d/gacha.conf << 'NGINX'
server {
    listen 80;
    server_name 120.26.32.238;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 错误页面
    error_page 404 /index.html;
}
NGINX

# 备份默认配置
mv /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak 2>/dev/null || true

# 测试 Nginx 配置
nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置测试通过"
else
    echo "❌ Nginx 配置测试失败"
    exit 1
fi

# 重启 Nginx
systemctl restart nginx
systemctl enable nginx

echo "✅ Nginx 重启成功"
ENDSSH

if [ $? -eq 0 ]; then
    echo "✅ Nginx 配置成功"
else
    echo "❌ Nginx 配置失败"
    exit 1
fi

# 5. 完成
echo ""
echo "🎉 部署完成！"
echo "📍 访问地址：http://120.26.32.238"
echo ""
