// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
import mdx from '@astrojs/mdx';
import rehypePrettyCode from 'rehype-pretty-code';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const shouldAnalyzeBundle = process.env.ANALYZE_BUNDLE === 'true';

export default defineConfig({
  site: 'https://www.scottwps.com',
  prefetch: true,
  vite: {
    plugins: [
      tailwindcss(),
      shouldAnalyzeBundle
        ? (await import('rollup-plugin-visualizer')).visualizer({
            emitFile: true,
            filename: 'stats.html',
          })
        : undefined,
    ].filter(Boolean),
  },
  integrations: [
    preact(),
    mdx({
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: { light: 'github-light', dark: 'github-dark' },
            keepBackground: false,
          },
        ],
      ],
    }),
    sitemap(),
  ],
});
