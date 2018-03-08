import './style/index.sass';

// cannot perform this effect on mobile devices
if (matchMedia('(min-width: 600px)').matches) {
  const PAGE_SEGMENTS = document.querySelectorAll('header,section,footer').length
  const container = document.querySelector('.container')
  const PAGE_HEIGHT = container.clientHeight

  const fakeScroller = document.createElement('DIV')
  fakeScroller.classList.add('heightbox')
  fakeScroller.style.height = `${PAGE_HEIGHT}px`
  document.body.insertBefore(fakeScroller, container)

  let resetScrollTimeout, previousScroll = 0
  window.addEventListener('scroll', () => {
    const currentScroll = document.documentElement.scrollTop
    const maxScroll = document.body.scrollHeight
    const scrollSegmentHeight = maxScroll / PAGE_SEGMENTS
    const currentSegment = previousScroll < currentScroll
      ? Math.ceil(currentScroll / scrollSegmentHeight)
      : Math.floor(currentScroll / scrollSegmentHeight)
    container.style.transform = `translateY(${-currentSegment * 100}vh)`
    previousScroll = currentScroll
    clearTimeout(resetScrollTimeout)
    resetScrollTimeout = setTimeout(() => {
      document.documentElement.scrollTop = scrollSegmentHeight * currentSegment
    }, 100)
  })
}

