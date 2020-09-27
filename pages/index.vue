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
  border-radius: 10px;
  border: 2px solid black;
  font-size: 1em;
  box-shadow: 0px 15px 35px rgba(50, 50, 93, 0.1),
    0px 5px 15px rgba(0, 0, 0, 0.0007);
}

.tag-select {
  appearance: none;
  background: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22black%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7em top 50%;
  background-size: 0.65em auto;
}

.search-field:focus {
  background: black;
  color: white;
  outline: none;
}

.tag-select:focus {
  background: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22white%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
    linear-gradient(to bottom, black 0%, black 100%);
  color: white;
  outline: none;
  background-repeat: no-repeat, repeat;
  background-position: right 1em top 50%, 0 0;
  background-size: 0.65em auto, 100%;
}

.memes {
  display: grid;
  padding: 0;
  margin: 30px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 30px;
}
</style>
