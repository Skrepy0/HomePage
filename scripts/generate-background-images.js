const baseURL = `/`

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（在ES模块中）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置项
const IMAGE_DIR = 'public/background';
const OUTPUT_FILE = 'app/utils/background/backgroundImages.ts';
const ALLOWED_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

function generate() {
  const rootDir = path.resolve(__dirname, '..');
  const imageDirPath = path.join(rootDir, IMAGE_DIR);
  const outputPath = path.join(rootDir, OUTPUT_FILE);

  if (!fs.existsSync(imageDirPath)) {
    console.error(`错误：目录 ${IMAGE_DIR} 不存在`);
    process.exit(1);
  }

  let files;
  try {
    files = fs.readdirSync(imageDirPath);
  } catch (err) {
    console.error('读取目录失败：', err);
    process.exit(1);
  }

  const imageFiles = files
    .filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ALLOWED_EXT.includes(ext);
    })
    .sort();

  if (imageFiles.length === 0) {
    console.warn(`警告：在 ${IMAGE_DIR} 中没有找到任何支持的图片文件`);
  }

  const urls = imageFiles.map(file => `${baseURL}background/${file}`);

  const tsContent = `// 此文件由脚本自动生成，请勿手动修改
// 生成时间：${new Date().toLocaleString()}

export const backgroundImageUrls: string[] = ${JSON.stringify(urls, null, 2)};
`;

  try {
    fs.writeFileSync(outputPath, tsContent, 'utf8');
    console.log(`成功生成 ${OUTPUT_FILE}，共 ${urls.length} 张图片`);
  } catch (err) {
    console.error('写入文件失败：', err);
    process.exit(1);
  }
}

generate();