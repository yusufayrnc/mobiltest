import pdfParse from 'pdf-parse';
import * as fs from 'fs';
const data = fs.readFileSync('data/tests/+P04.T07.F01_Operasyonel_Bolum_Genel_Yetenek_Testi.pdf');
pdfParse(data).then(result => {
  console.log('=== TEXT (first 5000 chars) ===');
  console.log(result.text.substring(0, 5000));
  console.log('=== PAGES ===');
  console.log('Page count:', result.numpages);
});
