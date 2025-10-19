import { create } from 'twrnc';

// 方式 A：用 require 读 CommonJS 配置（简单稳妥）
const config = require('../tailwind.config');

// 方式 B（如果 A 在你的 TS 配置下报警，改成直接写对象或用 JSON 文件）
// const config = { theme: { extend: { colors: { primary: '#4F46E5' } } } };

const tw = create(config);

export default tw;
