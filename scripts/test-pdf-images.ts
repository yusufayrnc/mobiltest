import { fromPath } from 'pdf2pic';
import * as fs from 'fs';
import * as path from 'path';

const outputDir = 'C:\\Users\\konya\\OneDrive\\Desktop\\project\\scripts\\pdf-images';
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

const options = {
  density: 200,
  saveFilename: 'page',
  savePath: outputDir,
  format: 'png',
  width: 1200,
  height: 1600
};

const pdf2pic = fromPath('data/tests/+P04.T07.F01_Operasyonel_Bolum_Genel_Yetenek_Testi.pdf', options);

for (let i = 1; i <= 9; i++) {
  pdf2pic(i).then(result => {
    console.log('Page', i, ':', result.path);
  }).catch(err => console.error('Page', i, 'error:', err));
}
