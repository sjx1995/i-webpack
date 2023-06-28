export default function jsonLoader(source) {
  // 将json转换成js对象，使用默认导出
  return `export default ${JSON.stringify(source)}`;
}
