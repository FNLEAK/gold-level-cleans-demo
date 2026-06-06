/** Build a smaller Unsplash URL for mobile-friendly loading. */
export function unsplashSrc(url: string, width: number, quality = 70) {
  return url
    .replace(/w=\d+/, `w=${width}`)
    .replace(/q=\d+/, `q=${quality}`)
}

export function portfolioSrcSet(url: string) {
  const mobile = unsplashSrc(url, 400, 68)
  const tablet = unsplashSrc(url, 640, 72)
  const desktop = unsplashSrc(url, 900, 75)
  return {
    src: tablet,
    srcSet: `${mobile} 400w, ${tablet} 640w, ${desktop} 900w`,
  }
}
