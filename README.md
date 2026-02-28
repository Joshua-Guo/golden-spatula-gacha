# 金铲铲之战抽奖模拟器

一个使用 Vue 3 + TypeScript + Tailwind CSS 开发的抽奖模拟器网页应用。

## 🎮 功能特性

- **4 个主题卡池**：玉剑传说、迴梦红楼、五福临门、月华之子
- **单抽/十连抽**：支持单次抽奖和十连抽奖
- **去重系统**：重复物品自动转化为棱彩兑换石
- **商店系统**：使用石头兑换未拥有的物品
- **抽奖限制**：每个用户最多 60 次抽奖机会
- **中大奖特效**：使用 canvas-confetti 实现撒花效果

## 🛠️ 技术栈

- **前端框架**：Vue 3 (Script Setup)
- **编程语言**：TypeScript
- **样式**：Tailwind CSS
- **状态管理**：Pinia
- **特效库**：canvas-confetti
- **构建工具**：Vite

## 📦 安装

```bash
npm install
```

## 🚀 开发

```bash
npm run dev
```

访问 http://localhost:5173/ 查看应用

## 📁 项目结构

```
golden-spatula-sim/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── PoolCard.vue     # 卡池卡片
│   │   ├── GachaMachine.vue # 抽奖机
│   │   ├── ResultModal.vue  # 结果弹窗
│   │   └── ShopModal.vue    # 商店/背包
│   ├── constants/           # 常量数据
│   │   └── pools.ts         # 卡池数据和概率配置
│   ├── stores/              # Pinia 状态管理
│   │   └── user.ts          # 用户状态和抽奖逻辑
│   ├── types.ts             # TypeScript 类型定义
│   ├── App.vue              # 主应用组件
│   ├── main.ts              # 入口文件
│   └── index.css            # 全局样式
├── index.html               # HTML 模板
├── package.json             # 依赖配置
├── tailwind.config.js       # Tailwind 配置
├── vite.config.ts           # Vite 配置
└── tsconfig.json            # TypeScript 配置
```

## 🎲 游戏规则

1. **抽奖次数**：每个用户最多 60 次抽奖机会
2. **货币系统**：棱彩兑换石是通用货币
3. **去重机制**：
   - 所有物品（除石头外）都是唯一的
   - 抽到重复物品会自动转化为石头
   - 转化数量 = 物品兑换价格的一半
4. **稀有度概率**：
   - 传说 (Mythic): 0.01%
   - 史诗 (Legendary): 0.30%
   - 特殊 (Special): 0.60%
   - 稀有 (Epic): 5.00%
   - 罕见 (Rare): 7.00%
   - 普通 (Uncommon): 14.40%
   - 普通 (Common): 72.69% → 产出 1-3 个石头

## 🏆 物品兑换价格

| 稀有度 | 兑换价格 | 重复奖励 |
|--------|---------|---------|
| 传说 (Mythic) | 600 石头 | 300 石头 |
| 史诗 (Legendary) | 150 石头 | 75 石头 |
| 特殊 (Special) | 150 石头 | 75 石头 |
| 稀有 (Epic) | 50 石头 | 25 石头 |
| 罕见 (Rare) | 20 石头 | 10 石头 |
| 普通 (Uncommon) | 10 石头 | 5 石头 |

## 🎨 UI 设计

- **深色系主题**：Slate-900 背景配合金色边框
- **渐变效果**：每个卡池都有独特的渐变背景
- **Emoji 图标**：使用 Emoji 代替图片素材
- **响应式设计**：支持不同屏幕尺寸

## 📝 开发说明

### 添加新卡池

在 `src/constants/pools.ts` 的 `POOLS` 数组中添加新卡池数据：

```typescript
{
  id: 'new-pool',
  name: '新卡池名称',
  nameEn: 'English Name',
  themeColor: 'color',
  gradient: 'from-color-600 via-color-500 to-color-600',
  icon: '🎯',
  description: '卡池描述',
  items: [
    { id: 'id', name: '物品名', rarity: 'Mythic', icon: '🐉', poolId: 'new-pool' },
    // ... 更多物品
  ]
}
```

### 调整概率

在 `src/constants/pools.ts` 的 `PROBABILITY_CONFIG` 中调整各稀有度的概率。

## ⚠️ 免责声明

本模拟器仅供娱乐和学习，与官方游戏《金铲铲之战》无关。所有数据均为虚构，不代表实际游戏概率。

## 📄 License

MIT
