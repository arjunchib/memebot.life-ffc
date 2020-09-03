<template>
  <button @click="play">
    <span>{{ data.name }}</span>
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
  methods: {
    play() {
      const url = `${process.env.SPACES_CDN_ENDPOINT}/memebot/audio/${this.data.name}.opus`;
      this.$audio.play(url);
    },
  },
};
</script>
