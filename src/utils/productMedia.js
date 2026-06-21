const VIDEO_URL_PATTERN = /\.(mp4|webm|mov|m4v|avi|mkv)(\?|#|$)/i;

export function isVideoMediaUrl(url) {
  if (!url) return false;
  const base = String(url).trim().split(/[?#]/)[0];
  return VIDEO_URL_PATTERN.test(base) || /\/videos?\//i.test(base);
}

/** Keep gallery images only; pull video out of legacy `images` arrays if needed. */
export function normalizeProductMedia(data = {}) {
  const rawImages = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
  let videoUrl = data.video_url || data.videoUrl || null;
  const galleryImages = [];

  for (const url of rawImages) {
    if (isVideoMediaUrl(url)) {
      if (!videoUrl) videoUrl = url;
      continue;
    }
    galleryImages.push(url);
  }

  return {
    ...data,
    images: galleryImages,
    video_url: videoUrl || null,
  };
}
