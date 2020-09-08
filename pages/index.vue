<template>
  <div>
    <header class="header">
      <h1>memebot</h1>
      <a
        href="https://discord.com/oauth2/authorize?client_id= 350733228098715658&scope=bot&permissions=3147840"
        >Add to Discord</a
      >
      <a href="https://paypal.me/arjunchib">Send me some money!</a>
    </header>
    <main class="memes">
      <Meme v-for="meme in memes" :key="meme.name" :data="meme" />
    </main>
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

<style scoped>
.header {
  margin: 30px;
}

.memes {
  display: grid;
  padding: 0;
  margin: 30px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 30px;
}
</style>
