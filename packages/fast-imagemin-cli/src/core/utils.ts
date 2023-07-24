import crypto from 'node:crypto'
import fs from 'node:fs'
import type { Encoding } from 'node:crypto'
import path from 'node:path'
import chalk from 'chalk'

export const isBoolean = (arg: unknown): arg is boolean => {
  return typeof arg === 'boolean'
}

export const isNotFalse = (arg: unknown): arg is boolean => {
  return !(isBoolean(arg) && !arg)
}

export const isImageExp = (fileName: string) => /\.(png|jpeg|gif|jpg|bmp|svg|webp)$/i.test(fileName)

// eslint-disable-next-line no-console
const log = console.log

export function debug(...args: any[]) {
  log(chalk.green('[fast-imagemin-cli]'), ...args)
}

export function walkSync(currentDirPath: string, callback: (filePath: string, dirent: fs.Dirent) => void) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach((dirent: fs.Dirent) => {
    const filePath = path.join(currentDirPath, dirent.name)
    if (dirent.isFile())
      callback(filePath, dirent)

    else if (dirent.isDirectory())
      walkSync(filePath, callback)
  })
}

/**
 * 获得内容的hash值
 *
 * @param {String} content 文件内容
 * @param {String} encoding 文件的编码，例如：'utf8' 等
 * @param {String} type hash算法，例如：'md5'、'sha1'、'sha256'、'sha512' 等
 * @returns {String}
 */
export function getHash(content: any, encoding: Encoding, type: string) {
  return crypto.createHash(type).update(content, encoding).digest('hex')
}

/**
 * 获得文件的hash值
 *
 * @param {String} filePath 文件路径
 * @returns {String}
 */
export function getHashOfFile(filePath: string) {
  return getHash(fs.readFileSync(filePath, 'utf8'), 'utf8', 'md5')
}

