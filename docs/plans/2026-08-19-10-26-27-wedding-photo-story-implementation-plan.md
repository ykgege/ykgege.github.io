# 专属婚礼照片故事页实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将现有动画页改造成无需构建、通过一个内容配置文件替换照片与文案的专属婚礼照片故事页。

**Architecture:** `content.js` 是唯一可编辑内容入口，并向浏览器和 Node 测试暴露同一份信息。语义化 `index.html` 与 `styles.css` 定义杂志风页面，`gallery.js` 根据配置渲染照片、记录图片加载失败。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Node 内置测试运行器。

---

## 文件结构

- Create: `content.js`，姓名、日期、地点、照片和短句。
- Create: `gallery.js`，照片故事渲染与图片加载异常处理。
- Create: `styles.css`，暖白杂志风与响应式规则。
- Create: `tests/content.test.js`，内容与页面静态检查。
- Modify: `index.html`，替换旧动画页面。
- Keep: `index.js`，保留用户现有修改；新页面不再引用该旧雪花脚本。

### Task 1: 建立可编辑内容配置

**Files:**
- Create: `content.js`
- Create: `tests/content.test.js`

- [ ] **Step 1: 写入失败测试**

```js
const test = require("node:test")
const assert = require("node:assert/strict")
const story = require("../content.js")

test("婚礼内容具备可渲染的必要字段", () => {
  assert.ok(story.coupleNames.trim())
  assert.match(story.date, /^\d{4}\.\d{2}\.\d{2}$/)
  assert.ok(Array.isArray(story.photos))
  assert.ok(story.photos.length >= 3 && story.photos.length <= 6)
  story.photos.forEach(({ src, alt, caption }) => {
    assert.equal(src, "123.jpg")
    assert.ok(alt.trim())
    assert.ok(caption.trim())
  })
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/content.test.js`

Expected: FAIL，提示无法加载 `../content.js`。

- [ ] **Step 3: 实现内容配置与替换说明**

```js
;(function exposeWeddingStory(root, factory) {
  const story = factory()
  if (typeof module !== "undefined" && module.exports) module.exports = story
  root.WeddingStory = story
})(globalThis, function createWeddingStory() {
  return {
    coupleNames: "Y & K",
    date: "2026.10.01",
    location: "Shanghai",
    closingLine: "愿我们的每一次回望，都有彼此。",
    photos: [
      { src: "123.jpg", alt: "两人的婚礼照片之一", caption: "从这一刻开始。", layout: "wide" },
      { src: "123.jpg", alt: "两人的婚礼照片之二", caption: "光落在我们身上。", layout: "portrait" },
      { src: "123.jpg", alt: "两人的婚礼照片之三", caption: "把平凡过成纪念。", layout: "wide" },
    ],
  }
})
```

将更多图片放在项目根目录后，在 `content.js` 的 `photos` 增加同结构对象；`src`、`alt`、`caption` 不可为空。当前所有示例均使用用户提供的 `123.jpg`。

- [ ] **Step 4: 运行测试，确认通过**

Run: `node --test tests/content.test.js`

Expected: PASS，显示 `婚礼内容具备可渲染的必要字段`。

- [ ] **Step 5: 提交配置层**

```powershell
git add content.js tests/content.test.js
git commit -m "新增婚礼照片内容配置"
```

### Task 2: 构建语义化页面与杂志风样式

**Files:**
- Modify: `index.html`
- Create: `styles.css`
- Keep: `index.js`（不再由页面引用）
- Modify: `tests/content.test.js`

- [ ] **Step 1: 写入静态结构检查**

```js
const fs = require("node:fs")

test("页面包含照片故事所需的语义区域", () => {
  const html = fs.readFileSync("index.html", "utf8")
  assert.match(html, /<main/)
  assert.match(html, /id="story"/)
  assert.match(html, /id="gallery"/)
  assert.match(html, /id="closing"/)
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/content.test.js`

Expected: FAIL，旧页面不包含 `main` 与 `gallery` 区域。

- [ ] **Step 3: 替换入口文档并创建样式表**

```html
<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="专属婚礼照片故事">
  <title>Our Story</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <main>
    <section class="hero" aria-labelledby="couple-names">
      <img class="hero__image" src="./123.jpg" alt="两人的婚礼主视觉照片">
      <div class="hero__content"><p class="eyebrow">OUR STORY</p><h1 id="couple-names"></h1><a href="#story" aria-label="浏览照片故事">SCROLL</a></div>
    </section>
    <section class="intro" id="story" aria-labelledby="story-title"><p class="eyebrow">A DAY TO REMEMBER</p><h2 id="story-title">一些关于我们的瞬间</h2></section>
    <section class="gallery" id="gallery" aria-label="婚礼照片故事"></section>
    <section class="closing" id="closing"><p class="eyebrow" id="event-meta"></p><p class="closing__line" id="closing-line"></p></section>
  </main>
  <script src="./content.js"></script>
  <script src="./gallery.js"></script>
</body>
</html>
```

`styles.css` 定义暖白 `#f6f3ee`、墨绿 `#183d35`、深灰 `#242321`；`.gallery` 用 Grid 实现单列与桌面双列；图片 `width: 100%`、`height: auto`；`@media (max-width: 700px)` 改单列；`@media (prefers-reduced-motion: reduce)` 禁止平滑滚动和过渡；不使用渐变、圆角卡片或持续动画。

- [ ] **Step 4: 运行测试，确认通过**

Run: `node --test tests/content.test.js`

Expected: PASS，两个测试均通过。

- [ ] **Step 5: 提交结构与样式**

```powershell
git add index.html styles.css tests/content.test.js
git commit -m "重构婚礼照片故事页面结构"
```

### Task 3: 渲染照片故事并验证图片状态

**Files:**
- Create: `gallery.js`
- Modify: `tests/content.test.js`

- [ ] **Step 1: 写入渲染脚本静态检查**

```js
test("照片渲染脚本包含加载失败提示与日志", () => {
  const script = fs.readFileSync("gallery.js", "utf8")
  assert.match(script, /console\.warn/)
  assert.match(script, /图片加载失败/)
  assert.match(script, /document\.createElement\("figure"\)/)
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/content.test.js`

Expected: FAIL，提示无法读取 `gallery.js`。

- [ ] **Step 3: 实现渲染与图片异常处理**

```js
;(function renderWeddingStory(story) {
  const gallery = document.querySelector("#gallery")
  document.querySelector("#couple-names").textContent = story.coupleNames
  document.querySelector("#event-meta").textContent = story.date + "  /  " + story.location
  document.querySelector("#closing-line").textContent = story.closingLine

  story.photos.forEach((photo, index) => {
    const figure = document.createElement("figure")
    figure.className = "gallery__item gallery__item--" + photo.layout
    const image = document.createElement("img")
    image.src = "./" + photo.src
    image.alt = photo.alt
    image.loading = index === 0 ? "eager" : "lazy"
    image.addEventListener("error", () => {
      image.hidden = true
      figure.classList.add("gallery__item--missing")
      console.warn("[婚礼照片页] 图片加载失败", { src: photo.src })
    })
    const caption = document.createElement("figcaption")
    caption.textContent = photo.caption
    figure.append(image, caption)
    gallery.append(figure)
  })
})(window.WeddingStory)
```

关键逻辑保持“内容配置与页面渲染分离”；加载失败只隐藏单张图片，不能中断其他照片和文案展示。

- [ ] **Step 4: 运行自动与手动验证**

Run: `node --test tests/content.test.js; node --check content.js; node --check gallery.js`

Expected: 全部通过，无语法错误。

打开 `index.html`，在 390px 和 1440px 宽度检查：无横向滚动；照片不遮挡文字；将一张照片临时改名后，控制台出现一次 `[婚礼照片页] 图片加载失败` 日志，其他图片仍可见。

- [ ] **Step 5: 提交渲染逻辑**

```powershell
git add gallery.js tests/content.test.js
git commit -m "实现婚礼照片故事渲染"
```

## 最终验收

- [ ] `node --test tests/content.test.js` 全部通过。
- [ ] `git diff --check` 无空白错误。
- [ ] 完成 390px 与 1440px 视觉检查。
- [ ] 照片仅引用本地文件，无外部网络依赖。
