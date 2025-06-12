# 2048 游戏

一个使用 React + TypeScript + ArcoDesign 开发的经典2048游戏。

## 功能特性

- 🎮 经典2048游戏玩法
- 🎨 美观的UI设计（基于ArcoDesign）
- 📱 响应式设计，支持移动端
- 🏆 分数记录和最高分保存
- ⌨️ 键盘控制（方向键）
- 🎯 游戏胜利和失败提示
- 🔄 重新开始功能
- 💾 本地存储最高分

## 游戏规则

1. 使用方向键（↑↓←→）移动方块
2. 当两个相同数字的方块碰撞时，它们会合并成一个
3. 每次移动后会随机生成一个新的方块（2或4）
4. 目标是创造出2048方块
5. 当无法移动时游戏结束

## 技术栈

- **React 18** - 前端框架
- **TypeScript** - 类型安全
- **ArcoDesign** - UI组件库
- **Vite** - 构建工具
- **CSS3** - 样式和动画

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── components/          # React组件
│   ├── GameBoard.tsx   # 游戏棋盘
│   ├── GameHeader.tsx  # 游戏头部
│   ├── GameOverModal.tsx # 游戏结束弹窗
│   └── GameInstructions.tsx # 游戏说明
├── types.ts            # TypeScript类型定义
├── gameLogic.ts        # 游戏核心逻辑
├── App.tsx             # 主应用组件
└── main.tsx            # 应用入口
```

## 游戏截图

游戏界面包含：
- 游戏标题和分数显示
- 4x4的游戏棋盘
- 重新开始按钮
- 游戏说明和键盘提示

享受游戏吧！🎉