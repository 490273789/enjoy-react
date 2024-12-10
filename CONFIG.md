# 项目搭建

## 1. menorepo

## 2. 安装依赖

### 安装公共依赖

```bash
pnpm add vitest -D -w
```

### 安装项目内的相互依赖

- 给scheduler 安装shared依赖

```bash
pnpm --filter scheduler add shared
pnpm --filter pkgName add react
```
