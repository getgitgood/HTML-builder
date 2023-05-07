const fs = require('fs');
const { readdir, stat } = fs.promises;
const path = require('path');

const url = path.resolve(__dirname, 'secret-folder');
const option = {withFileTypes: true};


readdir(url, option).then(
  data => {
    for (const file of data) {
      if (file.isFile()) {
        const filePath = path.join(url, file.name);
        const [fileExt, fileName] = [
          path.parse(filePath).ext.slice(1), 
          path.parse(filePath).name
        ];
        stat(filePath).then(stats => {
          const k = 1024;
          const fileSize = Number(stats.size / k).toFixed(3);
          console.log(
            `${fileName} - ${fileExt} - ${fileSize}kb
            \n--------------------------------------`);
        }).catch(
          error => console.log(error.message));
      }
    }
  }
).catch(
  error => console.log(error)
);

