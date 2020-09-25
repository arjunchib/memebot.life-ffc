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
    <main>
      <select v-model="selectedTag">
        <option>all</option>
        <option v-for="tag in tags" :key="tag">{{ tag }}</option>
      </select>
      <div class="memes">
        <Meme v-for="meme in filteredMemes" :key="meme.name" :data="meme" />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      memes: [],
      selectedTag: "all",
    };
  },
  computed: {
    tags() {
      return this.memes.reduce((acc, value) => {
        value.tags.forEach((tag) => acc.add(tag));
        return acc;
      }, new Set());
    },
    filteredMemes() {
      let memes = this.memes;
      if (this.selectedTag !== "all") {
        memes = memes.filter((meme) => meme.tags.includes(this.selectedTag));
      }
      return memes;
    },
  },
  async created() {
    this.memes = await this.$http.$get("/memebot/memes.json");
    this.memes.sort((a, b) =>
      a.name.localeCompare(b.name, "en", {
        sensitivity: "base",
        ignorePunctuation: true,
        numeric: true,
      })
    );
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
