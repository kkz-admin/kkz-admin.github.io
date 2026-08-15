module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist",
      url: [
        "http://localhost/",
        "http://localhost/blog/",
        "http://localhost/about/",
      ],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.95 }],
        "categories:best-practices": ["error", { minScore: 0.95 }],
        "categories:seo": ["error", { minScore: 0.95 }],
      },
    },
  },
};
