const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const textPath = path.join(__dirname, 'note.txt');

fs.writeFile(
  textPath,
  '',
  (err) => {
    if (err) throw err;
  }
);
stdout.write('Введите текст:\n')

stdin.on('data', data => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  } else {
    fs.appendFile(
      textPath,
      data,
      (err) => {
        if (err) throw err;
      }
    );
  }

})

process.on('SIGINT', () => {
  process.exit();
});


process.on('exit', () => stdout.write('Хорошего дня!'));
