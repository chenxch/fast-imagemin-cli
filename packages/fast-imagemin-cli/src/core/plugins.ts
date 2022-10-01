import type imagemin from 'imagemin'
import imageminGif from 'imagemin-gifsicle'
import imageminPng from 'imagemin-pngquant'
import imageminOptPng from 'imagemin-optipng'
import imageminJpeg from 'imagemin-mozjpeg'
import imageminSvgo from 'imagemin-svgo'
import imageminWebp from 'imagemin-webp'
import imageminJpegTran from 'imagemin-jpegtran'
import type { ImageMinOptions } from '../types/type'
import {
  debug,
  isBoolean,
  isNotFalse,
} from './utils.js'

export function getImageminPlugins(
  options: ImageMinOptions = {},
): imagemin.Plugin[] {
  const {
    gifsicle = true,
    webp = false,
    mozjpeg = false,
    pngquant = false,
    optipng = true,
    svgo = true,
    jpegTran = true,
  } = options

  const plugins: imagemin.Plugin[] = []

  if (isNotFalse(gifsicle)) {
    debug('gifsicle:', true)
    const opt = isBoolean(gifsicle) ? undefined : gifsicle
    plugins.push(imageminGif(opt))
  }

  if (isNotFalse(mozjpeg)) {
    debug('mozjpeg:', true)
    const opt = isBoolean(mozjpeg) ? undefined : mozjpeg
    plugins.push(imageminJpeg(opt))
  }

  if (isNotFalse(pngquant)) {
    debug('pngquant:', true)
    const opt = isBoolean(pngquant) ? undefined : pngquant
    plugins.push(imageminPng(opt))
  }

  if (isNotFalse(optipng)) {
    debug('optipng:', true)
    const opt = isBoolean(optipng) ? undefined : optipng
    plugins.push(imageminOptPng(opt))
  }

  if (isNotFalse(svgo)) {
    debug('svgo:', true)
    const opt = isBoolean(svgo) ? undefined : svgo
    plugins.push(imageminSvgo(opt))
  }

  if (isNotFalse(webp)) {
    debug('webp:', true)
    const opt = isBoolean(webp) ? undefined : webp
    plugins.push(imageminWebp(opt))
  }

  if (isNotFalse(jpegTran)) {
    debug('jpegTran:', true)
    const opt = isBoolean(jpegTran) ? undefined : jpegTran
    plugins.push(imageminJpegTran(opt))
  }
  return plugins
}
