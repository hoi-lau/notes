const path = require("path")
// Theme API.
module.exports = (options, ctx) => {
  const { themeConfig, siteConfig } = ctx

  // resolve algolia
  const isAlgoliaSearch =
    themeConfig.algolia ||
    Object.keys((siteConfig.locales && themeConfig.locales) || {}).some(
      (base) => themeConfig.locales[base].algolia
    )

  const enableSmoothScroll = themeConfig.smoothScroll === true

  return {
    alias() {
      return {
        "@AlgoliaSearchBox": isAlgoliaSearch
          ? path.resolve(__dirname, "components/AlgoliaSearchBox.vue")
          : path.resolve(__dirname, "noopModule.js"),
      }
    },

    plugins: [
      require('../plugins/excludepost'),
      ["@vuepress/active-header-links", options.activeHeaderLinks],
      ["@vuepress/search", {
        searchMaxSuggestions: 10
      }],
      ['@vuepress/pwa', {
        serviceWorker: true,
        updatePopup: true
      }],
      "@vuepress/back-to-top",
      "@vuepress/plugin-nprogress",
      [
        "@vuepress/plugin-blog",
        {
          itemPermalink: "/:regular",
          frontmatters: [
            {
              id: "tags",
              keys: ["tags"],
              path: "/tag/",
              layout: "Tags",
              scopeLayout: "Tags",
            },
            {
              id: "categories",
              keys: ["categories"],
              path: "/category/",
              layout: "Category",
              scopeLayout: "Category",
            }
            // {
            //   id: "timeline",
            //   keys: ["timeline"],
            //   path: "/timeline/",
            //   layout: "TimeLines",
            //   scopeLayout: "TimeLine",
            // },
          ],
        },
      ],
      [
        "container",
        {
          type: "tip",
          defaultTitle: {
            "/": "TIP",
            "/zh/": "提示",
          },
        },
      ],
      [
        "container",
        {
          type: "warning",
          defaultTitle: {
            "/": "WARNING",
            "/zh/": "注意",
          },
        },
      ],
      [
        "container",
        {
          type: "danger",
          defaultTitle: {
            "/": "WARNING",
            "/zh/": "警告",
          },
        },
      ],
      [
        "container",
        {
          type: "details",
          before: (info) =>
            `<details class="custom-block details">${
              info ? `<summary>${info}</summary>` : ""
            }\n`,
          after: () => "</details>\n",
        },
      ],
      ["smooth-scroll", enableSmoothScroll],
    ],
  }
}
