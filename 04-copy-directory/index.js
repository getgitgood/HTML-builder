const fs = require('fs');
const { mkdir, rm, readdir, copyFile } = fs.promises;
const path = require('path');

const copyPath = path.join(__dirname, 'files-copy');
const sourcePath = path.join(__dirname, 'files');

const optRmdir = {recursive: true, force: true};
const optReaddir = {WithFileTypes: true};
const optMkdir = {recursive: true};




async function copyDir(dist, from) {
  await mkdir(dist, optMkdir);
  const files = await readdir(from, optReaddir);
  for (const file of files) {
    const srcPath = path.join(from, file.name);
    const destPath = path.join(dist, file.name);
    if (file.isDirectory()) {
      await copyDir(destPath, srcPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

rm(copyPath, optRmdir).then(() => copyDir(copyPath, sourcePath));