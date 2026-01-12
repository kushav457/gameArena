let hoverAudio = null;

export function playCardHoverSound() {
  try {
    if (!hoverAudio) {
      hoverAudio = new Audio("/sounds/card-hover.mp3");
      hoverAudio.volume = 0.35;
    }
    hoverAudio.currentTime = 0;
    hoverAudio.play();
  } catch (err) {
    // Ignore autoplay/policy errors
  }
}

