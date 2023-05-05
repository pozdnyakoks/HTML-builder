const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');

const bundleFolderPath = path.join(__dirname, 'project-dist');
const originalStylesPath = path.join(__dirname, 'styles');
const bundlePath = path.join(bundleFolderPath, 'bundle.css');

async function getData() {
  const files = await fsPromises.readdir(originalStylesPath, { withFileTypes: true })

  fsPromises.writeFile(
    bundlePath,
    '',
    (err) => {
      if (err) throw err;
    }
  );

  for await (const dirent of files) {
    if (dirent.isFile()) {
      if (path.extname(dirent.name) === '.css') {
        const filePath = path.join(originalStylesPath, dirent.name)
        const stream = fs.createReadStream(filePath, 'utf-8');

        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          fs.appendFile(
            bundlePath,
            data,
            (err) => {
              if (err) throw err;
            }
          );
        });
      }
    };
  }
}

getData()
