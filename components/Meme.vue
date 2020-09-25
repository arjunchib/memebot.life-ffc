<template>
  <button class="meme" @click="play">
    <div ref="progressBar" class="progress-bar" @animationend="stop" />
    <div>
      <p class="name" :title="data.name">{{ data.name }}</p>
      <p class="aliases">{{ data.aliases.join(", ") }}</p>
    </div>
    <ul class="tags">
      <li v-for="tag in data.tags" :key="tag" class="tag">{{ tag }}</li>
    </ul>
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
  all: unset;
  display: flex;
  width: 200px;
  height: 100px;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 100ms linear, box-shadow 300ms linear;
  position: relative;
  z-index: 1;
  overflow: hidden;
  border-radius: 10px;
  border: 2px solid black;
  box-shadow: 0px 15px 35px rgba(50, 50, 93, 0.1),
    0px 5px 15px rgba(0, 0, 0, 0.0007);
}

.meme:hover {
  box-shadow: 0px 5px 5px rgba(50, 50, 93, 0.1),
    0px 5px 5px rgba(0, 0, 0, 0.0007);
}

.meme:not(:hover) {
  transform: none !important;
}

.meme:active {
  transition: transform 150ms linear, background 150ms linear;
  transform: perspective(50em) scale(99%) !important;
}

.meme:focus {
  background: black;
  color: white;
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

p {
  margin: 0;
}

.name {
  font-weight: 600;
  text-overflow: ellipsis;
  width: 100%;
  overflow: hidden;
}

.aliases {
  font-weight: 400;
  font-style: italic;
  font-size: 0.8em;
}

.tags {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.tag {
  font-size: 0.8em;
  font-weight: 400;
  display: block;
  padding: 0.2em 0.5em;
  border-radius: 1em;
  background: black;
  width: auto;
  color: white;
  margin: 0.2em 0.2em 0 0;
}

.meme:focus .tag {
  background: white;
  color: black;
}
</style>
