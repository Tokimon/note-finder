import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { viteCommonjs } from "@originjs/vite-plugin-commonjs"

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "./node_modules/kissfft-wasm/lib/kissfft.wasm",
          dest: ".",
        },
      ],
    }),
    solidPlugin(),
    viteCommonjs()
  ],
  server: {
    port: 3333,
  },
  build: {
    target: "esnext",
  },
  optimizeDeps: {
    exclude: ['kissfft-wasm']
  }
});
