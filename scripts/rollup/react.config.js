import { getBaseRollupPlugins, getPackageJson, resolvePkgPath } from "./utils";
import generatePackageJson from "rollup-plugin-generate-package-json";

/**
 * name - 包名
 * main - 入口文件
 */
const { name, module } = getPackageJson("react");

// 获取某个包的路径
const pkgPath = resolvePkgPath(name);

// 获取某个包打包后的路径
const pkgDistPath = resolvePkgPath(name, true);

const reactPkg = {
  input: `${pkgPath}/${module}`,
  output: {
    file: `${pkgDistPath}/index.js`,
    name: "React",
    format: "es",
  },
  plugins: [
    ...getBaseRollupPlugins(),
    generatePackageJson({
      inputFolder: pkgPath,
      outputFolder: pkgDistPath,
      baseContents: ({ name, description, version }) => ({
        name,
        description,
        version,
        main: "index.js",
      }),
    }),
  ],
};

const jsxDevRuntime = {
  input: `${pkgPath}/jsx-dev-runtime.ts`,
  output: {
    file: `${pkgDistPath}/jsx-dev-runtime.js`,
    name: "jsx-dev-runtime.js",
    format: "es",
  },
  plugins: getBaseRollupPlugins(),
};

const jsxRuntime = {
  input: `${pkgPath}/jsx-runtime.ts`,
  output: {
    file: `${pkgDistPath}/jsx-runtime.js`,
    name: "jsx-runtime.js",
    format: "es",
  },
  plugins: getBaseRollupPlugins(),
};

export default [reactPkg, jsxDevRuntime, jsxRuntime];
