<template>
  <div>
    <header class="header">
      <div>
        <div class="title">
          <img class="icon" src="~/assets/icon.svg" />
          <h1>memebot</h1>
        </div>
        <div class="links">
          <a
            href="https://discord.com/oauth2/authorize?client_id= 350733228098715658&scope=bot&permissions=3147840"
            >Add to Discord</a
          >
          <a href="https://paypal.me/arjunchib">Send me some money!</a>
        </div>
      </div>
      <div class="search">
        <label for="search" class="search-label">Search: </label>
        <input
          id="search"
          v-model="searchString"
          class="search-field"
          type="search"
        />
      </div>
      <div class="tag">
        <label for="tag" class="tag-label">Tag: </label>
        <select id="tag" v-model="selectedTag" class="tag-select">
          <option>all</option>
          <option v-for="tag in tags" :key="tag">{{ tag }}</option>
        </select>
      </div>
    </header>
    <main>
      <div class="memes">
        <Meme
          v-for="meme in memes"
          v-show="meme.show"
          :key="meme.name"
          :data="meme"
        />
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
  },
  watch: {
    selectedTag() {
      this.filter();
    },
    searchString() {
      this.filter();
    },
  },
  async created() {
    this.memes = await this.$http.$get("/memebot/memes.json");
    this.memes.forEach((meme) => (meme.show = true));
    this.memes.sort((a, b) =>
      a.name.localeCompare(b.name, "en", {
        sensitivity: "base",
        ignorePunctuation: true,
        numeric: true,
      })
    );
  },
  methods: {
    filter() {
      let memes = this.memes;
      if (this.searchString.length >= 2) {
        memes = memes.filter((meme) => {
          const commands = [meme.name, ...meme.aliases];
          const scores = commands.map((cmd) =>
            distance(cmd, this.searchString)
          );
          const score = Math.min(...scores);
          meme.searchScore = score;
          return score <= 3;
        });
        this.memes.sort((a, b) => a.searchScore - b.searchScore);
      } else {
        this.memes.sort((a, b) =>
          a.name.localeCompare(b.name, "en", {
            sensitivity: "base",
            ignorePunctuation: true,
            numeric: true,
          })
        );
      }
      if (this.selectedTag !== "all") {
        memes = memes.filter((meme) => meme.tags.includes(this.selectedTag));
      }
      this.memes.forEach((meme) => {
        meme.show = false;
      });
      memes.forEach((meme) => {
        meme.show = true;
      });
    },
  },
};
</script>

<style scoped>
.header {
  margin: 30px;
  display: flex;
  align-items: flex-end;
}

.title {
  display: flex;
  align-items: center;
}

.icon {
  height: 50px;
}

h1 {
  margin: 0 0 0 10px;
}

.links {
  margin-top: 10px;
}

.search {
  flex: 1 1 auto;
  margin: 0 30px;
}

.search-field,
.tag-select {
  height: 50px;
  width: 100%;
  padding: 10px;
  overflow: hidden;
  font-size: 1em;
}

.memes {
  display: grid;
  padding: 0;
  margin: 30px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-auto-flow: dense;
}
</style>
