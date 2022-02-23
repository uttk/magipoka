# Magipoka

Magipoka is a library for outputting `*.d.ts` files for type-safe routing from directory structures. It can be used to achieve zero-runtime type-safe routing.

## Feature

You can use Magipoka to output `*.d.ts` file to insert a type for type-safe routing into the Supported frameworks.

For example, It you output `next/link` as the target, it will insert the Union type generated from the `pages` directory into the `<Link />` props that `next/link` exports as default.

```
##### Next.js pages directory #####
.
├── pages
|   ├── user
|   |   └── [uid].tsx
|   ├── _app.tsx
|   ├── hoge.tsx
|   └── index.tsx
```

```ts
// magipoka.d.ts

declare module "next/link" {
  // The types generated based on routing `pages` directory in Next.js
  type PagesType = "/" | "/hoge" | `/user/${string}/`

  type LinkProps = {
    href: UrlObject | PagesType; // Insert the generated Union type
    // ...
  };

  export default Link(props: LinkProps): JSX;
}
```

By including the above generated `*.d.ts` file in your Next.js project, you can use type-safe routing where you using `<Link />`.

```tsx
import Link from "next/link";

const AnyComponent = () => {
  return (
    {/* 🛑 The following URL is an invalid URL and will cause a type error  */}
    <Link href="/bad/url">
      <a>any link</a>
    </Link>
  );
};
```

### About trailing slash

If the path contains uncertain values such as parameters, such as in dynamic routing in Next.js, `/` is added to the end of the generated type. This is due to the limitations of TypeScript's template string types. If you don't like this behavior, you'll need to use a utility function to remove the trailing slash.

```tsx
import Link from "next/link";
import { NextPagesType } from "magipoka/next";

const r = (path: NextPagesType): NextPagesType => {
  if (path === "/") return path;
  return path.replace(/\/$/, "") as NextPagesType;
};

const AnyComponent = () => {
  return (
    <>
      {/* 🛑 Valid path, but error due to type restriction */}
      <Link href="/user/1">
        <a>any link</a>
      </Link>

      {/* ✅ Make it be treated as "/user/1" */}
      <Link href={r("/user/1/")}>
        <a>any link</a>
      </Link>

      {/* ✅ If the trailing slash is acceptable, you can leave it as it is. */}
      <Link href="/user/1/">
        <a>any link</a>
      </Link>
    </>
  );
};
```

## Install

**npm (Local install)**

```shell
$> npm i --save-dev magipoka
```

**yarn (Local install)**

```shell
$> yarn add --dev magipoka
```

## Usage

To output a `*.d.ts` file, you can either set the options with `generate` command and run it, or create a config file and run the default command

### For the `generate` command

In the `generate` command, the target to be output is passed as arguments, and other settings are set using options.

```shell
$> magipoka generate [options] <targets...>
```

Now (2022/02), only `next` and `next/link` are available for output targets, but more will be added in the future.

You can set multiple output targets, but if a main target such as `next` is specified, sub-targets such as `next/link` will be ignored.( Because when `next` is specified, `next/link` is also set )

The options are as follows.

```
Options:
  -f, --force            Forces the output of the files
  -r, --rootDir <path>   set a root directory path
  -o, --outDir <path>    set a output directry path
  -n, --filename <name>  set a output filename
  -c, --config <path>    set a config path
  -h, --help             display help for command
```

Even if there is a config file, if these options are specified on the command line, the value of the options will take precedence.

### For default command

If you have a config file, you can use the default command to generate a `*.d.ts` file.

```shell
$> magipoka
```

By defualt, it reads `magipoka.config.js` in the root directory, but you can set a relative path to the config file by using the `-c, --config` option.

```shell
$> magipoka --config ./path/to/magipoka.config.js
```

## Config File

You can use `magipoka.config.js` to config the output settings, and the values that can be set are as follows.

```js
// magipoka.config.js

/** @type {import("magipoka").MagipokaConfig} */
module.exports = {
  /**
   * Allow files to be overwritten
   */
  force: false,

  /**
   * Root directory path
   */
  rootDir: "./",

  /**
   * Output directory path
   */
  outDir: "./dist",

  /**
   * Output file name
   */
  filename: "magipoka.d.ts",

  /**
   * Target of the type to generate
   */
  target: [],
};
```
