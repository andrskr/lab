import type { Config } from '@react-router/dev/config';

/** @see https://reactrouter.com/api/framework-conventions/react-router.config.ts */
export default {
  appDirectory: 'src',
  ssr: true,
  future: {
    unstable_optimizeDeps: true,
    unstable_viteEnvironmentApi: true,
  },
} satisfies Config;
