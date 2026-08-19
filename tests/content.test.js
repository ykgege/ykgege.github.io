const test = require("node:test")
const assert = require("node:assert/strict")
const fs = require("node:fs")
const story = require("../content.js")

test("婚礼内容具备可渲染的必要字段", () => {
  assert.ok(story.coupleNames.trim())
  assert.match(story.date, /^\d{4}\.\d{2}\.\d{2}$/)
  assert.ok(Array.isArray(story.photos))
  assert.ok(story.photos.length >= 3 && story.photos.length <= 6)

  story.photos.forEach(({ src, alt, caption }) => {
    assert.equal(src, "123.jpg")
    assert.ok(fs.existsSync(src))
    assert.ok(alt.trim())
    assert.ok(caption.trim())
  })
})

test("页面包含照片故事所需的语义区域", () => {
  const html = fs.readFileSync("index.html", "utf8")

  assert.match(html, /<main/)
  assert.match(html, /id="story"/)
  assert.match(html, /id="gallery"/)
  assert.match(html, /id="closing"/)
})

test("照片渲染脚本包含加载失败提示与日志", () => {
  const script = fs.readFileSync("gallery.js", "utf8")

  assert.match(script, /console\.warn/)
  assert.match(script, /图片加载失败/)
  assert.match(script, /document\.createElement\("figure"\)/)
})

test("照片按原始比例完整展示", () => {
  const styles = fs.readFileSync("styles.css", "utf8")

  assert.match(styles, /\.hero__image\s*\{[^}]*object-fit:\s*contain/)
  assert.match(styles, /\.gallery__item img\s*\{[^}]*height:\s*auto/)
  assert.doesNotMatch(styles, /object-fit:\s*cover/)
  assert.doesNotMatch(styles, /aspect-ratio:\s*(?:16\s*\/\s*10|4\s*\/\s*5)/)
})
