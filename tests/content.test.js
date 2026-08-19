const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const story = require("../content.js")

test("婚礼内容具备可渲染的必要字段", () => {
  assert.equal(story.coupleNames, "yk 和 zs")
  assert.equal(story.date, "2027/2/14")
  assert.ok(Array.isArray(story.photos))
  assert.ok(story.photos.length >= 3 && story.photos.length <= 6)

  story.photos.forEach(({ src, alt, caption }) => {
    assert.equal(src, "123.jpg")
    assert.ok(fs.existsSync(src))
    assert.ok(alt.trim())
    assert.ok(caption.trim())
  })
})

test("页面提供幻灯片和婚礼信息容器", () => {
  const html = fs.readFileSync("index.html", "utf8")

  assert.match(html, /id="slideshow"/)
  assert.match(html, /id="slide-image"/)
  assert.match(html, /id="slide-caption"/)
  assert.match(html, /id="slide-counter"/)
  assert.match(html, /data-action="previous"/)
  assert.match(html, /data-action="next"/)
})

test("照片渲染脚本包含加载失败提示与日志", () => {
  const script = fs.readFileSync("gallery.js", "utf8")

  assert.match(script, /console\.warn/)
  assert.match(script, /图片加载失败/)
  assert.match(script, /document\.createElement\("figure"\)/)
})

test("幻灯片脚本包含自动播放和触摸切换", () => {
  const script = fs.readFileSync("slideshow.js", "utf8")

  assert.match(script, /setInterval/)
  assert.match(script, /touchstart/)
  assert.match(script, /touchend/)
  assert.match(script, /showSlide/)
})

test("照片按原始比例完整展示", () => {
  const styles = fs.readFileSync("styles.css", "utf8")

  assert.match(styles, /\.hero__image\s*\{[^}]*height:\s*auto/)
  assert.match(styles, /\.gallery__item img\s*\{[^}]*height:\s*auto/)
  assert.doesNotMatch(styles, /object-fit:/)
  assert.doesNotMatch(styles, /overflow:\s*hidden/)
  assert.doesNotMatch(styles, /aspect-ratio:\s*(?:16\s*\/\s*10|4\s*\/\s*5)/)
})
