import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages 子路径：仓库名 electronics-exam-syllabus
// 必须设置 base，否则部署后资源 404。
export default defineConfig({
  base: '/electronics-exam-syllabus/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // dev 模式下不启用 SW（避免缓存干扰调试）；build 时生效
      devOptions: {
        enabled: false,
      },
      includeAssets: [
        'apple-touch-icon.png',
        'pwa-192.png',
        'pwa-512.png',
        '.nojekyll',
      ],
      manifest: {
        name: '电子技术基础考纲',
        short_name: '电子技术考纲',
        description: '电子技术基础（数字电子技术 + 模拟电子技术）考试大纲 · 离线备考工具',
        lang: 'zh-CN',
        start_url: '/electronics-exam-syllabus/',
        scope: '/electronics-exam-syllabus/',
        // 素雅灰蓝（数电主题色），无渐变
        theme_color: '#475569',
        background_color: '#fafaf9',
        display: 'standalone',
        orientation: 'portrait-primary',
        categories: ['education', 'books', 'productivity'],
        icons: [
          {
            src: '/electronics-exam-syllabus/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/electronics-exam-syllabus/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/electronics-exam-syllabus/pwa-maskable-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/electronics-exam-syllabus/pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,svg,png,ico,woff,woff2,ttf,eot}',
          '大纲/**/*.md',
        ],
        // 公式数据 + KaTeX 字体较多，调高上限
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
    }),
  ],
  server: {
    port: 5173,
    // 允许开发时通过 IP 访问（移动端调试）
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // 公式数据较大，适当提高警告阈值
    chunkSizeWarningLimit: 800,
  },
});
