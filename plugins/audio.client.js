class VueAudio {
  constructor() {
    this.audio = new Audio();
    this.audio.addEventListener("canplaythrough", () => {
      this.audio.play();
    });
  }

  play(url) {
    this.audio.src = url;
  }
}

export default (context, inject) => {
  const audio = new VueAudio();
  inject("audio", audio);
};
