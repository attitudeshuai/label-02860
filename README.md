# 校园生活服务平台

基于 Vue 3 + Vite + Bootstrap 5 构建的校园生活服务平台，为在校师生提供便捷的一站式校园服务。

## 1. How to Run

### Docker Compose 部署

```bash
docker compose up -d --build
```

启动后访问 http://localhost:8081（规范端口）

停止服务：`docker compose down`

### 本地开发

```bash
cd frontend
npm install
npm run dev
```

启动后访问 http://localhost:8081

### 构建部署

```bash
cd frontend
npm install
npm run build
```

构建产物位于 `frontend/dist/` 目录。

## 2. Services

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端应用（本地开发） | http://localhost:8081 | Vue 3 SPA |
| 前端应用（Docker） | http://localhost:8081 | Nginx 静态托管 |

### 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue 3 | 3.4+ | 前端框架（Composition API） |
| Vite | 5.x | 构建工具 |
| Bootstrap 5 | 5.3+ | 响应式 UI 框架 |
| Bootstrap Icons | 1.11+ | SVG 图标库 |
| Vue Router | 4.x | 路由管理 |
| Pinia | 2.x | 状态管理 |

## 3. 测试账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 管理员 | admin | admin123 | 拥有管理员标识 |
| 普通用户 | user | user123 | 普通用户权限 |

## 4. 题目内容

以"校园生活服务平台"为核心，需包含至少 5 个功能页面，具体页面要求 
如下： 
（1）首页：展示校园公告、热门服务分类、校园地图入口 
（2）服务详情页：展示单个服务的具体信息（如服务描述、预约方式） 
（3）登录/注册页：实现表单验证与数据绑定 
（4）公告列表页：分页展示公告，支持按时间筛选 
（5）个人中心页：展示用户信息，支持修改基本资料 
2．技术要求 
（1）必须使用 Vue.js 核心语法（响应式数据、计算属性、组件、路由等） 
（2）必须基于 Vite 构建项目，集成 Bootstrap 实现响应式布局与组件（如导航栏、 
卡片、表单） 
（3）至少包含 1 处表单验证、1 处路由数据传递 
3．代码规范 
（1）组件命名符合 PascalCase 规范，路由命名符合 kebab-case 规范 
（2）代码缩进统一（2 个或 4 个空格），关键逻辑添加注释 
（3）样式统一使用 Bootstrap 工具类或 Scoped 样式，避免全局样式冲突 刘志帅命名

## 5. 项目结构

```
label-02860/
├── docker-compose.yml       # Docker Compose 配置
├── frontend/                # 前端应用
│   ├── Dockerfile           # 前端镜像构建
│   ├── nginx.conf           # Nginx 配置
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   │   ├── ui/          # 基础 UI 组件
│   │   │   └── business/    # 业务组件
│   │   ├── views/           # 页面级组件
│   │   ├── stores/          # Pinia 状态管理
│   │   ├── router/          # 路由配置
│   │   ├── data/            # Mock 数据
│   │   ├── utils/           # 工具函数（logger、errorHandler、storage、validators）
│   │   ├── styles/          # 全局样式 + Design Tokens
│   │   ├── App.vue          # 根组件
│   │   └── main.js          # 入口文件
│   ├── index.html           # HTML 入口
│   ├── vite.config.js       # Vite 配置
│   └── package.json         # 依赖管理
├── docs/
│   └── project_design.md    # 设计文档
├── README.md                # 项目说明
└── draft.md                 # 项目总结
```

## 6. 功能清单

- [x] **首页**：校园公告轮播、热门服务分类卡片、校园地图入口、最新公告列表
- [x] **服务详情页**：服务信息展示、预约方式说明、相关服务推荐（路由参数传递）
- [x] **登录/注册页**：双 Tab 切换、实时表单验证、密码强度校验、数据双向绑定
- [x] **公告列表页**：分页展示、按分类筛选、按时间范围筛选、置顶排序
- [x] **个人中心页**：用户信息展示、个人资料修改、账号安全信息、退出确认弹窗
- [x] **全局功能**：路由守卫（未登录跳转）、Toast 消息反馈、页面过渡动画、响应式布局

## 7. 异常处理与日志

项目内置统一异常处理和日志框架：

- **logger** (`utils/logger.js`)：多级别日志（debug/info/warn/error），开发环境全量输出，生产环境默认仅 warn 以上
- **errorHandler** (`utils/errorHandler.js`)：全局捕获 Vue 渲染错误、未处理 Promise 拒绝、路由导航错误
- **runSafe**：业务层异步函数安全包装器，捕获异常并返回 `{ ok, data, error }`

使用示例：`import { logger } from '@/utils/logger'` → `logger.info('消息')`

## 8. 开发与数据说明

本项目当前使用本地 Mock / localStorage 数据用于演示与开发联调：

- **数据来源**：`frontend/src/data/mock.js` 提供初始化数据
- **持久化方式**：用户登录状态和个人资料修改通过 localStorage 持久化，页面刷新后数据保持
- **用途**：开发调试、课程演示
- **生产环境**：接入真实后端接口后替换 Pinia Store 中的数据源即可

## 9. 编码说明

本项目所有文件使用 UTF-8 编码，确保中文正常显示：

- 源代码：UTF-8 without BOM
- HTML：`<meta charset="UTF-8">`
- 配置文件：UTF-8
