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
      <input v-model="searchString" type="text" />
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
import { distance } from "fastest-levenshtein";

export default {
  data() {
    return {
      memes: [],
      selectedTag: "all",
      searchString: "",
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
      if (this.searchString.length >= 2) {
        memes = memes.filter((meme) => {
          const commands = [meme.name, ...meme.aliases];
          const scores = commands.map((cmd) =>
            distance(cmd, this.searchString)
          );
          const score = Math.max(...scores);
          meme._searchScore = score;
          return score < 3;
        });
        memes.sort((a, b) => a._searchScore - b._searchScore);
        console.log(memes);
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
