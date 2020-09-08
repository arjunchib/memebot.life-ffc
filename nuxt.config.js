require("dotenv").config();

export default {
  components: true,
  target: "static",
  modules: ["@nuxt/http"],
  buildModules: ["@nuxtjs/dotenv"],
  plugins: ["~/plugins/audio.client.js"],
  css: ["~/css/main.css"],
  http: {
    browserBaseURL: process.env.SPACES_CDN_ENDPOINT,
    baseURL: process.env.SPACES_ENDPOINT,
  },
  env: {
    SPACES_CDN_ENDPOINT: process.env.SPACES_CDN_ENDPOINT,
  },
};
