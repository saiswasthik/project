// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   base: './',
//   plugins: [react()],
//   build: {
//     rollupOptions: {
//       input: {
//         main: './src/main.jsx',
//       },
//     },
//   },
// }); 

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [react()],
});
