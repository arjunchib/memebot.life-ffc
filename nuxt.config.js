require("dotenv").config();

export default {
  components: true,
  target: "static",
  modules: ["@nuxt/http"],
  buildModules: ["@nuxtjs/dotenv"],
  http: {
    browserBaseURL: process.env.SPACES_CDN_ENDPOINT,
    baseURL: process.env.SPACES_ENDPOINT,
  },
  env: {
    SPACES_CDN_ENDPOINT: process.env.SPACES_CDN_ENDPOINT,
  },
};
