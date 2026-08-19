# 浪漫婚礼幻灯片实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将婚礼照片页改为完整原图的浪漫全屏幻灯片，显示姓名和日期，支持自动、按钮、页码和触摸切换。

**Architecture:** `content.js` 继续保存照片与文案。新建 `slideshow.js` 管理当前索引、自动播放和输入事件；`gallery.js` 停止渲染纵向照片墙。`index.html` 提供一张语义化幻灯片、控制按钮和页码容器。

**Tech Stack:** HTML5、CSS3、原生 JavaScript、Node 内置测试运行器。

---

## 文件结构

- Modify: `index.html`，替换纵向故事区域。
- Modify: `styles.css`，添加全屏幻灯片和浪漫视觉规则。
- Modify: `gallery.js`，仅保留内容渲染所需的共享逻辑或删除其引用。
- Create: `slideshow.js`，状态、自动播放、按钮、页码与触摸控制。
- Modify: `tests/content.test.js`，验证页面、样式和控制逻辑。

### Task 1: 写入幻灯片结构与失败测试

**Files:**
- Modify: `tests/content.test.js`
- Modify: `index.html`

- [ ] **Step 1: 写入失败测试**

```js
test("页面提供幻灯片和婚礼信息容器", () => {
  const html = fs.readFileSync("index.html", "utf8")
  assert.match(html, /id="slideshow"/)
  assert.match(html, /id="slide-image"/)
  assert.match(html, /id="slide-caption"/)
  assert.match(html, /id="slide-counter"/)
  assert.match(html, /data-action="previous"/)
  assert.match(html, /data-action="next"/)
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/content.test.js`

Expected: FAIL，旧页面没有 `slideshow`。

- [ ] **Step 3: 替换页面结构**

```html
<main id="slideshow" aria-label="yk 和 zs 的婚礼照片">
  <section class="slide" aria-live="polite">
    <img id="slide-image" alt="">
    <div class="slide__veil"></div>
    <div class="slide__romance" aria-hidden="true"></div>
    <div class="slide__content">
      <p class="slide__counter" id="slide-counter"></p>
      <p class="slide__caption" id="slide-caption"></p>
      <div class="slide__names" id="couple-names"></div>
      <p class="slide__date" id="event-meta"></p>
    </div>
  </section>
  <nav class="slide-controls" aria-label="切换照片">
    <button type="button" data-action="previous" aria-label="上一张照片">&#8592;</button>
    <div id="slide-dots" aria-label="照片页码"></div>
    <button type="button" data-action="next" aria-label="下一张照片">&#8594;</button>
  </nav>
</main>
```

入口文档依次加载 `content.js` 和 `slideshow.js`，不再加载 `gallery.js`。

- [ ] **Step 4: 运行测试，确认通过**

Run: `node --test tests/content.test.js`

Expected: 原有测试和页面结构测试通过。

- [ ] **Step 5: 提交结构**

```powershell
git add index.html tests/content.test.js
git commit -m "新增婚礼幻灯片页面结构"
```

### Task 2: 实现幻灯片状态与控制

**Files:**
- Create: `slideshow.js`
- Modify: `tests/content.test.js`

- [ ] **Step 1: 写入失败测试**

```js
test("幻灯片脚本包含自动播放和触摸切换", () => {
  const script = fs.readFileSync("slideshow.js", "utf8")
  assert.match(script, /setInterval/)
  assert.match(script, /touchstart/)
  assert.match(script, /touchend/)
  assert.match(script, /showSlide/)
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/content.test.js`

Expected: FAIL，无法读取 `slideshow.js`。

- [ ] **Step 3: 实现最小控制器**

```js
const intervalMs = 6000
let currentIndex = 0
let autoPlayTimer
let touchStartX = 0

function showSlide(nextIndex) {
  currentIndex = (nextIndex + story.photos.length) % story.photos.length
  const photo = story.photos[currentIndex]
  image.src = "./" + photo.src
  image.alt = photo.alt
  caption.textContent = photo.caption
  counter.textContent = String(currentIndex + 1).padStart(2, "0") + " / " + String(story.photos.length).padStart(2, "0")
  dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === currentIndex)))
  console.info("[婚礼幻灯片] 已切换照片", { index: currentIndex, src: photo.src })
}

function restartAutoPlay() {
  window.clearInterval(autoPlayTimer)
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    autoPlayTimer = window.setInterval(() => showSlide(currentIndex + 1), intervalMs)
  }
}
```

绑定按钮、页码、`touchstart` 和 `touchend`。滑动距离大于 40px 时切换；每次手动切换调用 `restartAutoPlay()`。图片加载失败时保留当前画面并输出 `[婚礼幻灯片] 图片加载失败`。

- [ ] **Step 4: 运行测试和语法检查**

Run: `node --test tests/content.test.js; node --check slideshow.js`

Expected: 全部 PASS，无语法错误。

- [ ] **Step 5: 提交控制器**

```powershell
git add slideshow.js tests/content.test.js
git commit -m "实现婚礼幻灯片控制"
```

### Task 3: 添加浪漫视觉与完整照片规则

**Files:**
- Modify: `styles.css`
- Modify: `tests/content.test.js`

- [ ] **Step 1: 写入失败测试**

```js
test("幻灯片保留完整照片并提供浪漫视觉层", () => {
  const styles = fs.readFileSync("styles.css", "utf8")
  assert.match(styles, /\.slide__image|#slide-image/)
  assert.match(styles, /height:\s*auto/)
  assert.match(styles, /\.slide__romance/)
  assert.match(styles, /#6f2735/)
  assert.doesNotMatch(styles, /object-fit:\s*cover/)
})
```

- [ ] **Step 2: 运行测试，确认失败**

Run: `node --test tests/content.test.js`

Expected: FAIL，旧样式没有幻灯片视觉层。

- [ ] **Step 3: 实现样式**

```css
#slideshow { background: #24191b; min-height: 100svh; overflow: hidden; }
.slide { min-height: calc(100svh - 80px); position: relative; }
#slide-image { display: block; height: auto; margin: 0 auto; max-height: calc(100svh - 80px); max-width: 100%; width: auto; }
.slide__veil { background: rgba(36, 25, 27, 0.26); inset: 0; pointer-events: none; position: absolute; }
.slide__romance { border: 1px solid rgba(255, 246, 237, 0.66); inset: 20px; pointer-events: none; position: absolute; }
.slide__names, .slide__date { color: #fff6ed; font-family: Georgia, serif; text-align: center; }
.slide-controls { align-items: center; background: #6f2735; display: flex; justify-content: space-between; min-height: 80px; padding: 0 24px; }
@media (prefers-reduced-motion: reduce) { .slide { transition: none; } }
```

按钮使用透明背景、固定尺寸和可见焦点；移动端保持完整照片并允许触摸滑动。

- [ ] **Step 4: 运行最终验证**

Run: `node --test tests/content.test.js; node --check slideshow.js; git diff --check`

Expected: 全部 PASS，无语法或空白错误。

- [ ] **Step 5: 提交样式**

```powershell
git add styles.css tests/content.test.js
git commit -m "新增浪漫婚礼幻灯片视觉"
```

## 手动验收

- [ ] 在 390px 和 1440px 宽度下，照片完整可见且页面不需要纵向滚动。
- [ ] 首图显示 `yk 和 zs` 与 `2027/2/14`。
- [ ] 6 秒后切换；按钮、页码、左右滑动均可切换。
- [ ] 启用减少动态效果后，不自动切换。
