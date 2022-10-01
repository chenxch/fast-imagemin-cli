<p align='center'>
<img src="https://cdn.staticaly.com/gh/chenxch/pic-image@master/20221001/Group-1.4tovhdat6w40.webp" />
</p>

<p align='center'>
A tool for fast secondary compression of images.
</p>

  <a href="https://www.npmjs.com/package/fast-imagemin-cli">
    <img src="https://img.shields.io/npm/v/fast-imagemin-cli" alt="Version" />
  </a>
  <a href="https://www.npmjs.com/package/fast-imagemin-cli">
    <img src="https://img.shields.io/github/languages/top/chenxch/fast-imagemin-cli" alt="Languages" />
  </a>
  <a href="https://www.npmjs.com/package/fast-imagemin-cli">
    <img src="https://img.shields.io/npm/l/fast-imagemin-cli" alt="License" />
  </a>
  <a href="https://github.com/AttoJS/fast-imagemin-cli/stargazers">
    <img src="https://img.shields.io/github/stars/chenxch/fast-imagemin-cli" alt="Star" />
  </a>
  <a href="https://www.npmjs.com/package/fast-imagemin-cli">
    <img src="https://img.shields.io/npm/dm/fast-imagemin-cli" alt="Download" />
  </a>


Inspired by [easy-tinypng-cli](https://github.com/sudongyuer/easy-tinypng-cli) and [vite-plugin-imagemin](https://github.com/vbenjs/vite-plugin-imagemin)

# Why
In the daily production mode, it is always necessary to compress a large number of image resources.

- When using `vite-plugin-imagemin`, it has to be recompressed every time you build, which I think is unnecessary.
- When using `easy-tinypng-cli`, it needs to be connected to the Internet, and there is a limit of 500, which cannot meet a large number of processing.

so, a compression tool that can be locally unlimited and can avoid duplication of work is needed.

# Usage
## Install
```shell
# pnpm
pnpm install vite-plugin-imagemin -D

# npm
npm install vite-plugin-imagemin -D

# yarn
yarn add vite-plugin-imagemin -D
```

## Config
`fm.config.ts` or `fm.config.json`
- inclde(required): The image directory that needs to be compressed will be automatically traversed recursively.
- options: Imagemin configuration items

```ts
// fm.config.ts
import { defineFmConfig } from 'fast-imagemin-cli/support'

export default defineFmConfig({
  include: ['./src/assets'], // string | string[]
  options: {
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  },
})

```

### Options

| params   | type                                  | default | default                                                      |
| -------- | ------------------------------------- | ------- | ------------------------------------------------------------ |
| svgo     | `object` or `false`                   | -       | See [Options](https://github.com/svg/svgo/#what-it-can-do)   |
| gifsicle | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-gifsicle) |
| mozjpeg  | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-mozjpeg)  |
| optipng  | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-optipng)  |
| pngquant | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-pngquant) |
| webp     | `object` or `false`                   | -       | See [Options](https://github.com/imagemin/imagemin-webp)     |

## Add Script
```json
// package.json
{
  "scripts": {
    "fm": "fm" // or "fm --force" forced compression
  }
}
```

## Demo
`packages/playground`
[xlegex](https://github.com/chenxch/xlegex)
### first
<img src="https://cdn.staticaly.com/gh/chenxch/pic-image@master/20221001/image.5e3wp5v8xdg0.webp" />

You will find that one of the `.png` files takes up to `76930`ms. If it takes so long each time, it will greatly affect the work efficiency.
### second
<img src="https://cdn.staticaly.com/gh/chenxch/pic-image@master/20221001/image.15yct1xao9z4.webp"/>