import path from "path";
import fs from "fs";
import ts from "rollup-plugin-typescript2";
import cjs from "@rollup/plugin-commonjs";

// 源文件路径
const sourcePath = path.resolve(__dirname, "../../packages");

// 打包产物路径
const distPath = path.resolve(__dirname, "../../dist/node_modules");

// 生成打包路径
export const resolvePkgPath = (pkgName, isDist) =>
  isDist ? `${distPath}/${pkgName}` : `${sourcePath}/${pkgName}`;

// 获取package.json的内容
export const getPackageJson = (pkgName) => {
  const path = `${resolvePkgPath(pkgName)}/package.json`;
  const str = fs.readFileSync(path, { encoding: "utf-8" });
  console.log("[ str ] >", str);
  return JSON.parse(str);
};

// roll up 插件配置
export const getBaseRollupPlugins = ({ typescript = {} } = {}) => {
  return [cjs(), ts(typescript)];
};
