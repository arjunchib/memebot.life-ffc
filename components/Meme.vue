<template>
  <!-- v-once means the component will not update -->
  <button v-once class="meme" @click="play">
    <div ref="progressBar" class="progress-bar" @animationend="stop" />
    <div>
      <p class="name" :title="data.name">{{ data.name }}</p>
    </div>
  </button>
</template>

<script>
export default {
  name: "Meme",
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isPlaying: false,
    };
  },
  methods: {
    stop() {
      this.isPlaying = false;
      setTimeout(() => (this.$refs.progressBar.style.animationName = ""), 0);
    },
    play() {
      const url = `${process.env.SPACES_CDN_ENDPOINT}/memebot/audio/${this.data.name}.opus`;
      this.$bus.$emit("play");
      this.$bus.$once("play", this.stop);
      this.$audio.addEventListener(
        "canplaythrough",
        () => {
          this.$refs.progressBar.style.animationName = "progress";
          this.$refs.progressBar.style.animationDuration = `${this.$audio.duration}s`;
          this.$audio.play();
          this.isPlaying = true;
          this.$el.style.transform = "perspective(50em)";
        },
        { once: true }
      );
      this.$audio.src = url;
    },
  },
};
</script>

<style>
@keyframes progress {
  0% {
    width: 0;
  }
  100% {
    width: 100%;
  }
}
</style>

<style scoped>
.meme {
  cursor: pointer;
}

.progress-bar {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 0%;
  background: #fa2539;
  z-index: -1;
  animation-timing-function: linear;
  animation-iteration-count: 1;
}

.name {
  font-weight: 600;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}
</style>
