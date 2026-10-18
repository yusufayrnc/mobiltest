import pdfParse from 'pdf-parse';
import * as fs from 'fs';
import * as path from 'path';

export interface ParsedPDF {
  text: string;
  numPages: number;
  fileName: string;
}

export async function parsePDF(filePath: string): Promise<ParsedPDF> {
  const data = fs.readFileSync(filePath);
  const result = await pdfParse(data);
  return {
    text: result.text,
    numPages: result.numpages,
    fileName: path.basename(filePath)
  };
}

export function findPDFsInDir(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.toLowerCase().endsWith('.pdf'))
    .map(f => path.join(dir, f));
}
