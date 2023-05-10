const fs = require('fs');
const { mkdir, rm, readdir, copyFile } = fs.promises;
const path = require('path');

let copyPath = path.join(__dirname, 'files-copy');
let sourcePath = path.join(__dirname, 'files');

const optRmdir = {recursive: true, force: true};
const optReaddir = {withFileTypes: true};
const optMkdir = {recursive: true};

async function copyDir(dist, from) {
  await mkdir(dist, optMkdir);
  const files = await readdir(from, optReaddir);
  for (const file of files) {
    let srcPath = path.join(from, file.name);
    let destPath = path.join(dist, file.name);
    if (file.isDirectory()) {
      await copyDir(destPath, srcPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

rm(copyPath, optRmdir).then(() => copyDir(copyPath, sourcePath));