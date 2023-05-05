const fs = require('fs/promises');
const { mkdir, rmdir } = require('fs/promises')
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function getData() {
  await rmdir(copyFolderPath, { recursive: true });
  await mkdir(copyFolderPath, { recursive: true });
  const files = await fs.readdir(folderPath, { withFileTypes: true })
  for await (const dirent of files) {
    if (dirent.isFile()) {
      const filePath = path.join(folderPath, dirent.name);
      const copyFilePath = path.join(copyFolderPath, dirent.name)
      fs.copyFile(filePath, copyFilePath)
    };
  }
}

getData()
