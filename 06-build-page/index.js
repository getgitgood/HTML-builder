const fs = require('fs');
const path = require('path');
const { writeFile, mkdir, readFile, readdir, copyFile, unlink, rmdir } = require('fs/promises');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const htmlPath = path.join(distPath, 'index.html');
const assetsPath = path.join(__dirname, 'assets');

const option = { withFileTypes: true };
const optRmdir = {recursive: true, force: true};
const optMkdir = {recursive: true};

async function mergeStyle(dist, from) {
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
  }
  );
}

async function copyDir(dist, from) {
  await mkdir(dist, optMkdir);
  const files = await readdir(from, option);
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

async function init() {
  let html = '';
  await readFile(templatePath, 'utf8').then( value =>
    html += value
  );
    
  let files = await readdir(componentsPath, option);

  for (const file of files) {
    const componentPath = path.join(componentsPath, file.name);
    const ext = path.extname(componentPath);
    if (file.isFile() && ext === '.html') {
      await readFile(componentPath, 'utf8').then(value => {
        const filename = `{{${file.name.replace(ext, '')}}}`;
        const firstIndex = html.indexOf(filename);
        const lastIndex = firstIndex + filename.length;
        const head = html.slice(0, firstIndex);
        const tail = html.slice(lastIndex);
        let result = head + value + tail;
        html = result;
      });
    }
  }

  await wipeFolder(distPath);

  await mkdir(distPath, optMkdir).then(writeFile(htmlPath, html));

  await mergeStyle(path.join(distPath, 'style.css'), stylesPath);

  await copyDir(path.join(distPath, 'assets'), assetsPath);

  console.log(`\nBundle successfully merged to ${distPath}\n`);
}

async function wipeFolder(dist) {
  try {
      const innerContent = await readdir(dist, {withFileTypes: true}, err => {
          if (err) return err;
      });
      for (const file of innerContent) {
          if (file.isDirectory()) {
              await recreateFolder(path.join(dist, file.name));
          }
          if (file.isFile()) await unlink(path.join(dist, file.name))
      }
      await rmdir(dist)

  } catch (err) {
    return;
  }
}

init();
