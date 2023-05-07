const fs = require('fs');
const { mkdir, rm, readdir, copyFile } = fs.promises;
const path = require('path');

const copyDir = path.join(__dirname, 'files-copy');
const srcDir = path.join(__dirname, 'files');

const optRmdir = {recursive: true, force: true};
const optReaddir = {WithFileTypes: true};
const optMkdir = {recursive: true};


rm(copyDir, optRmdir).then(() => {
  mkdir(copyDir, optMkdir).then(
    readdir(srcDir, optReaddir)
      .then(files => {
        for (const file of files) {
          const srcPath = path.join(srcDir, file);
          const copyPath = path.join(copyDir, file);
          copyFile(srcPath, copyPath);
        }
      })
  );
});
