import { cloudflare } from '@cloudflare/vite-plugin';
import { lingui } from '@lingui/vite-plugin';
import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';
import macrosPlugin from 'vite-plugin-babel-macros';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    macrosPlugin(),
    lingui(),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    ...(process.env.CI
      ? []
      : [
          {
            ...visualizer({
              template: 'treemap',
              gzipSize: true,
              brotliSize: true,
              emitFile: true,
            }),
            apply: 'build' as const,
          },
        ]),
  ],
});
