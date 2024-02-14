import { parse } from 'csv-parse';
import fs from 'node:fs';

// procurando o path (url) do arquivo tasks.csv
const csvPath = new URL('./tasks.csv', import.meta.url);

// criando um stream de leitura
const stream = fs.createReadStream(csvPath);

// configurações do csv
const csvParse = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2
});

async function run() {
  const linesParse = stream.pipe(csvParse);

  for await (const line of linesParse) {
    const [title, description] = line;

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
      })
    })

    // Está linha serve para que poder visualizar a importação acontecer
    await wait(1000)
  }
}

run()
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}