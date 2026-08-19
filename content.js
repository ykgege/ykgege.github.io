;(function exposeWeddingStory(root, factory) {
  const story = factory()

  if (typeof module !== "undefined" && module.exports) {
    module.exports = story
  }

  root.WeddingStory = story
})(globalThis, function createWeddingStory() {
  // 仅需修改此处，即可替换页面的姓名、日期和照片文案。
  return {
    coupleNames: "yk 和 zs",
    date: "2027/2/14",
    location: "Shanghai",
    closingLine: "愿我们的每一次回望，都有彼此。",
    photos: [
      { src: "123.jpg", alt: "两人的婚礼照片之一", caption: "从这一刻开始。", layout: "wide" },
      { src: "123.jpg", alt: "两人的婚礼照片之二", caption: "光落在我们身上。", layout: "portrait" },
      { src: "123.jpg", alt: "两人的婚礼照片之三", caption: "把平凡过成纪念。", layout: "wide" },
    ],
  }
})
