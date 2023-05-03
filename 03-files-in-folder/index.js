const fs = require('fs/promises');
const path = require('path');
const { stdout } = process;

const folderPath = path.join(__dirname, 'secret-folder')

async function getData() {
  const files = await fs.readdir(folderPath, { withFileTypes: true })

  for await (const dirent of files) {
    if (dirent.isFile()) {
      const filePath = path.join(folderPath, dirent.name);
      const fileInfo = await fs.stat(filePath)

      const fileName = dirent.name.slice(0, dirent.name.indexOf('.'))
      const fileExt = path.extname(dirent.name).slice(1)
      const fileSize = fileInfo.size
      stdout.write(`${fileName} - ${fileExt} - ${fileSize}\n`);
    };
  }
}

getData()
