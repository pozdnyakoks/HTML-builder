const fs = require('fs');
const fsPromises = require('fs/promises');
const { mkdir, rmdir } = require('fs/promises')
const path = require('path');

const projectFolderPath = path.join(__dirname, 'project-dist');
const originalStylesPath = path.join(__dirname, 'styles');
const stylesBundlePath = path.join(projectFolderPath, 'style.css');
const assetsFolder = path.join(__dirname, 'assets');
const assetsCopyFolder = path.join(projectFolderPath, 'assets');
const template = path.join(__dirname, 'template.html');
const index = path.join(projectFolderPath, 'index.html');

const components = path.join(__dirname, 'components');

async function bundleCss() {
  const files = await fsPromises.readdir(originalStylesPath, { withFileTypes: true })
  fsPromises.writeFile(
    stylesBundlePath,
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
            stylesBundlePath,
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

async function copyAssets(assetsFolder, copyAssetsFolder) {

  const files = await fsPromises.readdir(assetsFolder, { withFileTypes: true })
  for await (const dirent of files) {
    if (dirent.isFile()) {
      const filePath = path.join(assetsFolder, dirent.name);
      const copyFilePath = path.join(copyAssetsFolder, dirent.name)
      fsPromises.copyFile(filePath, copyFilePath)
    } else {
      const recursivePath = path.join(assetsFolder, dirent.name);
      const recursiveCopyPath = path.join(copyAssetsFolder, dirent.name)
      await mkdir(recursiveCopyPath, { recursive: true });
      copyAssets(recursivePath, recursiveCopyPath)
    };
  }
}

async function replaceInFile() {
  fs.copyFile(template, index, async (err) => {
    if (err) {
      console.log("Error Found:", err);
    }
    else {
      const componentsObj = {};

      let indexContent = await fsPromises.readFile(index, 'utf-8');
      const files = await fsPromises.readdir(components, { withFileTypes: true })
      for (const dirent of files) {
        if (path.extname(dirent.name) === '.html') {
          const direntPath = path.join(components, dirent.name);
          const direntContent = await fsPromises.readFile(direntPath, 'utf-8');
          const direntName = dirent.name.slice(0, dirent.name.indexOf('.'))
          componentsObj[`{{${direntName}}}`] = direntContent
        }
      }
      for (key in componentsObj) {
        const replaced = indexContent.replace(key, componentsObj[key])
        await fsPromises.writeFile(index, replaced);
        indexContent = await fsPromises.readFile(index, 'utf-8');
      }
    }
  });


}

async function getData() {
  await mkdir(assetsCopyFolder, { recursive: true });
  for (const file of await fsPromises.readdir(assetsCopyFolder)) {
    await fsPromises.unlink(path.join(assetsCopyFolder, file));
  }
  await bundleCss()
  await copyAssets(assetsFolder, assetsCopyFolder);
  await replaceInFile();
}



getData()
