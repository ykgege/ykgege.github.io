;(function initializeSlideshow(story) {
  const slideshow = document.querySelector("#slideshow")
  const image = document.querySelector("#slide-image")
  const caption = document.querySelector("#slide-caption")
  const counter = document.querySelector("#slide-counter")
  const dotsContainer = document.querySelector("#slide-dots")
  const previousButton = document.querySelector('[data-action="previous"]')
  const nextButton = document.querySelector('[data-action="next"]')
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
  const intervalMs = 6000
  let currentIndex = 0
  let autoPlayTimer
  let touchStartX = 0
  let dots = []

  if (!story || !story.photos.length || !slideshow || !image || !caption || !counter || !dotsContainer) {
    console.error("[婚礼幻灯片] 初始化失败，缺少内容或页面容器")
    return
  }

  document.querySelector("#couple-names").textContent = story.coupleNames
  document.querySelector("#event-meta").textContent = story.date

  function formatCounter(index) {
    return String(index + 1).padStart(2, "0") + " / " + String(story.photos.length).padStart(2, "0")
  }

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.setAttribute("aria-current", String(index === currentIndex))
    })
  }

  // 图片预加载成功后才替换画面，避免失败时丢失当前照片。
  function showSlide(nextIndex) {
    const normalizedIndex = (nextIndex + story.photos.length) % story.photos.length
    const photo = story.photos[normalizedIndex]
    const preload = new Image()

    preload.addEventListener("load", () => {
      image.classList.remove("is-visible")
      window.requestAnimationFrame(() => {
        currentIndex = normalizedIndex
        image.src = "./" + photo.src
        image.alt = photo.alt
        caption.textContent = photo.caption
        counter.textContent = formatCounter(currentIndex)
        updateDots()
        image.classList.add("is-visible")
        console.info("[婚礼幻灯片] 已切换照片", { index: currentIndex, src: photo.src })
      })
    }, { once: true })

    preload.addEventListener("error", () => {
      console.warn("[婚礼幻灯片] 图片加载失败", { src: photo.src })
    }, { once: true })

    preload.src = "./" + photo.src
  }

  function stopAutoPlay() {
    window.clearInterval(autoPlayTimer)
  }

  function restartAutoPlay() {
    stopAutoPlay()
    if (!reducedMotion.matches) {
      autoPlayTimer = window.setInterval(() => showSlide(currentIndex + 1), intervalMs)
    }
  }

  function selectSlide(index) {
    showSlide(index)
    restartAutoPlay()
  }

  story.photos.forEach((photo, index) => {
    const dot = document.createElement("button")
    dot.type = "button"
    dot.className = "slide-dot"
    dot.setAttribute("aria-label", "查看第 " + String(index + 1) + " 张照片")
    dot.addEventListener("click", () => selectSlide(index))
    dotsContainer.append(dot)
    dots.push(dot)
  })

  previousButton.addEventListener("click", () => selectSlide(currentIndex - 1))
  nextButton.addEventListener("click", () => selectSlide(currentIndex + 1))

  slideshow.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX
    restartAutoPlay()
  }, { passive: true })

  slideshow.addEventListener("touchend", (event) => {
    const offset = event.changedTouches[0].screenX - touchStartX
    if (Math.abs(offset) > 40) selectSlide(currentIndex + (offset < 0 ? 1 : -1))
  }, { passive: true })

  slideshow.addEventListener("mouseenter", stopAutoPlay)
  slideshow.addEventListener("mouseleave", restartAutoPlay)
  reducedMotion.addEventListener("change", restartAutoPlay)

  showSlide(0)
  restartAutoPlay()
})(window.WeddingStory)
