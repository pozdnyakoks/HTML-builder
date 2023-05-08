
const fsPromises = require('fs/promises')
const { mkdir } = require('fs/promises')
const path = require('path');

const folderPath = path.join(__dirname, 'files');
const copyFolderPath = path.join(__dirname, 'files-copy');

async function getData() {
  await mkdir(copyFolderPath, { recursive: true });
  for (const file of await fsPromises.readdir(copyFolderPath)) {
    await fsPromises.unlink(path.join(copyFolderPath, file));
  }
  const files = await fsPromises.readdir(folderPath, { withFileTypes: true })
  for await (const dirent of files) {
    if (dirent.isFile()) {
      const filePath = path.join(folderPath, dirent.name);
      const copyFilePath = path.join(copyFolderPath, dirent.name)
      fsPromises.copyFile(filePath, copyFilePath)
    };
  }
}

getData()