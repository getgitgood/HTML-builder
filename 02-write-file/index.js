const fs = require('fs');
const path = require('path');
const { rawListeners } = require('process');
const { stdout, stdin } = process;

const output = fs.createWriteStream(
  path.join(__dirname, 'input.txt'), 'utf-8'
);

let data = '';

stdout.write(`\nPlease, type something. It'll be saved in "input.txt".\n \nnote: "exit" to leave.\n\n`);
stdin.on('data', data => {

  const encodedData = data.toString();
  if (encodedData !== 'exit\r\n') {
    output.write(data, error => {
      if (error) console.error(error.message);
      stdout.write(
        `\n\nYour text has been saved. Type anything else or type "exit" to leave.\n\n`)
      })} else {
    process.on('exit', () => console.log('\nCya! Come again!\n'))
    process.exit()
  }
})

process.on('SIGINT', () => {
  console.log('\nBye-bye! Hope to see you soon!\n');
  process.exit();
});
