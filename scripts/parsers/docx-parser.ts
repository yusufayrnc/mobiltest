import mammoth from 'mammoth';
import * as fs from 'fs';
import * as path from 'path';

export interface ParsedDOCX {
  text: string;
  images: { contentType: string; buffer: Buffer }[];
  fileName: string;
}

export async function parseDOCX(filePath: string): Promise<ParsedDOCX> {
  const textResult = await mammoth.extractRawText({ path: filePath });
  
  let images: { contentType: string; buffer: Buffer }[] = [];
  try {
    const imagesResult = await mammoth.extractImages({ path: filePath });
    images = imagesResult.images;
  } catch {
    // mammoth may not have extractImages in all versions
  }

  return {
    text: textResult.value,
    images,
    fileName: path.basename(filePath)
  };
}

export function findDOCXsInDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.docx'))
    .map(f => path.join(dir, f));
}
