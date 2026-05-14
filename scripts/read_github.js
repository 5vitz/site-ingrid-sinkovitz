import https from 'https';

const files = [
  'src/components/ProjectModal.tsx'
];

async function fetchRaw(file) {
  return new Promise((resolve) => {
    https.get(`https://raw.githubusercontent.com/5vitz/site-ingrid-sinkovitz/main/${file}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`---FILE_START:${file}---`);
        console.log(data);
        console.log(`---FILE_END:${file}---`);
        resolve();
      });
    });
  });
}

async function run() {
  for (const f of files) {
    await fetchRaw(f);
  }
}

run();
