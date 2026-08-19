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
