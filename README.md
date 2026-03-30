# JTMetrics

**JTMetrics** is a lightweight and extensible library for calculating **code metrics** in JavaScript and TypeScript repositories.  
It parses your code, generates **Abstract Syntax Trees (ASTs)**, and applies a collection of built-in or custom metrics to analyze **code structure, maintainability, and quality**.


## Features

- **Built-in Metrics**: Includes a curated set of default metrics (files, functions, classes, coupling, etc.).
- **Custom Metrics**: Easily add your own metrics by creating modules with visitors and post-processing hooks.
- **AST-Powered Analysis**: Uses AST traversal to provide accurate, in-depth results.
- **Ignore Files**: Skip specific files or directories via a `.metricsignore` file.
- **Flexible Configuration**: Choose to load built-in metrics, custom metrics, or both.


## Installation

```sh
npm install jtmetrics
```


## Usage

To use the library, import the `calculateMetrics` function and call it with the appropriate parameters:

```js
import { calculateMetrics } from 'jtmetrics'

const results = await calculateMetrics({
  codePath: './path/to/code',               // Required: string. Directory (Repository) to analyze.
  customMetricsPath: './path/to/custom/metrics', // Optional: string. Load additional metrics from this folder.
  useDefaultMetrics: true,                  // Optional: boolean. Load bundled/default metrics. Default: true.
  metricsIgnoreFilePath: 'path/to/.metricsignore' // Optional: string. Path to a .metricsignore file to skip files/directories.
})

console.log(results)
```


## Parameters

| Parameter                | Type      | Required | Default | Description                                                                                     |
|--------------------------|-----------|----------|---------|-------------------------------------------------------------------------------------------------|
| `codePath`               | `string`  | ✅       | —       | Path to the source code directory to analyze. The analyzer will scan it recursively.           |
| `customMetricsPath`      | `string`  | ❌       | —       | Path to a folder containing custom metric modules.                                             |
| `useDefaultMetrics`      | `boolean` | ❌       | `true`  | Whether to load built-in metrics. Set to `false` to run only custom metrics.                   |
| `useBuiltinMetrics`      | `boolean` | ❌       | `true`  | **Legacy:** Alias for `useDefaultMetrics`. If present, it takes precedence.                      |
| `metricsIgnoreFilePath`  | `string`  | ❌       | —       | Path to a `.metricsignore` file (one path per line) to skip files or directories.              |

### Behavior Matrix

| `useDefaultMetrics` | `customMetricsPath`         | Metrics Loaded                 |
|---------------------|----------------------------|-------------------------------|
| `true`              | _(not provided)_          | Built-in metrics only         |
| `true`              | ✅ Provided               | Built-in + custom metrics     |
| `false`             | ✅ Provided               | Custom metrics only           |
| `false`             | _(not provided)_          | ❌ Throws error (no metrics)  |


## Built-in Metrics

The library comes with the following built-in metrics. Click each link for detailed documentation:

| Metric ID                       | Name                            | Description                                                                    | Documentation                                                     |
| ------------------------------- | ------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `files`                         | **Files**                       | Identifies all source files in the repository.                                 | [files.doc.md](./docs/files.doc.md)                               |
| `lines-per-file`                | **Lines Per File**              | Counts total and non-empty lines for each source file.                         | |
| `functions-per-file`            | **Functions Per File**          | Counts all functions declared per file.                                        | [functionsPerFile.doc.md](./docs/functionsPerFile.doc.md)         |
| `parameter-count`               | **Parameter Count**             | Counts declared parameters for each named function.                            | |
| `function-length`               | **Function Length**             | Counts the lines of code within each function.                                 | |
| `function-coupling`             | **Function Coupling**           | Measures **fan-in** and **fan-out** at the function level.                     | [functionCoupling.doc.md](./docs/functionCoupling.doc.md)         |
| `classes-per-file`              | **Classes Per File**            | Lists all classes and their methods/properties per file.                       | [classesPerFile.doc.md](./docs/classesPerFile.doc.md)             |
| `class-coupling`                | **Class Coupling**              | Measures **fan-in** and **fan-out** between class methods.                     | [classCoupling.doc.md](./docs/classCoupling.doc.md)               |
| `class-dependency-summary`      | **Class Dependency Summary**    | Aggregates fan-in/fan-out totals for each class.                               |                                                                   |
| `function-dependency-summary`   | **Function Dependency Summary** | Aggregates fan-in/fan-out totals for each named function.                      |                                                                   |
| `file-coupling`                 | **File Coupling**               | Measures file-level dependencies (imports/require).                            | [fileCoupling.doc.md](./docs/fileCoupling.doc.md)                 |
| `import-instability`            | **Import Instability**          | Computes file instability based on afferent/efferent coupling.                 |                                                                   |
| `dependency-centrality`         | **Dependency Centrality**       | Computes in-degree, out-degree, and total centrality from the dependency graph. |                                                                   |
| `instance-mapper`               | **Instance Mapper**             | Maps instances to their class types for resolving method calls.                | [instanceMapper.doc.md](./docs/instanceMapper.doc.md)             |


## Creating Custom Metrics

To add your own metrics:

1. Create a new module in your custom metrics directory.
2. Export the following:
    - `state`: Initial state of the metric.
    - `visitors`: AST visitors to collect data.
    - `postProcessing` *(optional)*: A function to finalize results.

**Example:**

```js
const state = {
  metricName: 'Custom Metric',
  description: 'Description of the custom metric.',
  result: {},
  id: 'custom-metric-unique-id',
  dependencies: ['result-a', 'result-b'],
  status: false
}

const visitors = {
  // Example visitors:
  // Program(path) { doSomething(path.node) ... }
  // ClassDeclaration(path) { doSomethingElse(path.node) ... }
}

function postProcessing(state) {
  // Clean up or finalize the metric
  if (state.currentFile) delete state.currentFile
  if (state.dependencies) delete state.dependencies
  state.status = true
}

export { state, visitors, postProcessing }
```


## ASTs & visitors

ASTs are Babel-style (parsed with `@babel/parser`), so metric `visitors` should expect Babel node types and visitor signatures (e.g., `Program`, `FunctionDeclaration`, `ImportDeclaration`). Traversal uses `@babel/traverse`; when in doubt, follow Babel's visitor conventions.


## Contributing

Contributions are welcome!  
Feel free to open issues or submit pull requests to:

- Add new metrics
- Improve documentation
- Fix bugs

> Developed on **Linux** with **Node.js 22.14.0 LTS**.


## License

MIT License © 2024-present Daniel Zazzali