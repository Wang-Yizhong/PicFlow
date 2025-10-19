/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',        // Expo Router 页面
    './components/**/*.{js,jsx,ts,tsx}', // 你的组件目录（有就保留）
  ],
  theme: { extend: {} },
};
