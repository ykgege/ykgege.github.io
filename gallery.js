;(function renderWeddingStory(story) {
  const gallery = document.querySelector("#gallery")
  const heroImage = document.querySelector(".hero__image")

  if (!story || !gallery || !heroImage) {
    console.error("[婚礼照片页] 页面初始化失败，缺少内容或容器")
    return
  }

  document.querySelector("#couple-names").textContent = story.coupleNames
  document.querySelector("#event-meta").textContent = story.date + "  /  " + story.location
  document.querySelector("#closing-line").textContent = story.closingLine

  const firstPhoto = story.photos[0]
  heroImage.src = "./" + firstPhoto.src
  heroImage.alt = firstPhoto.alt

  // 由内容配置生成图片，用户添加照片时无需改动页面结构。
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

  console.info("[婚礼照片页] 已加载照片故事", { count: story.photos.length })
})(window.WeddingStory)
