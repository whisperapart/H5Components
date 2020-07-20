
## 开发

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布文档

```bash

# 构建开发环境
npm run build:prod


# 构建测试环境
npm run build:prod

# 构建生产环境
npm run build:prod
```

## 发布静态资源

```bash

# 构建开发环境
npm run lib


# 构建测试环境
npm run lib:test

# 构建预发布
npm run build:pre
```

# 构建生产环境
npm run build:prd
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix

#请遵循代码开发规范，否则后期版本更新可能有问题
1、更新版本请修改package.json的版本号


```

