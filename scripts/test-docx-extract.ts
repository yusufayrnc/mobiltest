import mammoth from 'mammoth';
import * as fs from 'fs';

async function main() {
  const result = await mammoth.extractRawText({ path: 'data/tests/+P04.T07.F05_Muhakeme_Testi.docx' });
  console.log('=== DOCX TEXT (first 5000 chars) ===');
  console.log(result.value.substring(0, 5000));

  const images = await mammoth.extractImages({ path: 'data/tests/+P04.T07.F05_Muhakeme_Testi.docx' });
  console.log('=== IMAGES ===');
  console.log('Image count:', images.length);
  images.forEach((img, i) => console.log(i, img.contentType, img.path));
}

main().catch(console.error);
