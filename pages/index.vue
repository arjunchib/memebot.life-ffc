<template>
  <div>
    <h1>memebot</h1>
    <a
      href="https://discord.com/oauth2/authorize?client_id= 350733228098715658&scope=bot&permissions=3147840"
      >Add to Discord</a
    >
    <a href="https://ko-fi.com/memebot">Buy me a Coffee!</a>
    <ul class="memes">
      <li v-for="meme in memes" :key="meme.name">
        <Meme :data="meme" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      memes: [],
    };
  },
  async created() {
    this.memes = await this.$http.$get("/memebot/memes.json");
  },
};
</script>
