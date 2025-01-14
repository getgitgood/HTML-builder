const fs = require('fs');
const path = require('path');
const { readdir, rm } = require('fs/promises');
const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist', 'bundle.css');


async function mergeStyle(dist, from) {
  const option = {withFileTypes: true};
  const optRm = {recursive: true, force: true};
  rm(dist, optRm).then(() => 
    readdir(from, option).then( files => {
      for (const file of files) {
        const inputPath = path.join(from, file.name);
        if (path.extname(inputPath) === '.css' && file.isFile()) {
          fs.readFile(inputPath, 'utf-8', (error, data) => {
            if (error) console.log(error.message);
            data += '\n';
            fs.appendFile(dist, data, error => {
              if (error) console.log(error.message);
            });
          });
        }
      }
      console.log(`\nStyles succesfuly merged to ${dist}\n`);
    })
  );
}

mergeStyle(distDir, stylesDir);

