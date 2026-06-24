import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 子路径：仓库名 electronics-exam-syllabus
// 必须设置 base，否则部署后资源 404。
export default defineConfig({
  base: '/electronics-exam-syllabus/',
  plugins: [react()],
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
