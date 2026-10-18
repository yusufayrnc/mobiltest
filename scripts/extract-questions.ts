import * as fs from 'fs';
import * as path from 'path';
import { parsePDF, findPDFsInDir } from './parsers/pdf-parser';
import { parseDOCX, findDOCXsInDir } from './parsers/docx-parser';
import { parseTestContent, inferTestKey } from './parsers/question-parser';
import { generateJSONOutput, generateTSOutput } from './generators/test-data-generator';
import { matchAssetsToQuestions } from './utils/asset-matcher';

const PROJECT_ROOT = process.cwd();
const TESTS_DIR = path.join(PROJECT_ROOT, 'data', 'tests');
const OUTPUT_JSON = path.join(PROJECT_ROOT, 'data', 'tests-generated.json');
const OUTPUT_TS = path.join(PROJECT_ROOT, 'data', 'tests.ts');

async function extractFromPDF(filePath: string, testKey: string) {
  console.log(`📄 Parsing PDF: ${path.basename(filePath)}`);
  const parsed = await parsePDF(filePath);
  const result = parseTestContent(parsed.text, parsed.fileName, testKey);
  
  // Match assets
  const assets = matchAssetsToQuestions(testKey, result.questions.length, PROJECT_ROOT);
  for (let i = 0; i < result.questions.length; i++) {
    result.questions[i].imageFile = assets[i];
  }
  
  console.log(`  ✅ Extracted ${result.questions.length} questions`);
  console.log(`  ✅ Answer key: ${Object.keys(result.answerKey).length} answers`);
  return result;
}

async function extractFromDOCX(filePath: string, testKey: string) {
  console.log(`📄 Parsing DOCX: ${path.basename(filePath)}`);
  const parsed = await parseDOCX(filePath);
  const result = parseTestContent(parsed.text, parsed.fileName, testKey);
  
  // Match assets (reasoning may not have images)
  const assets = matchAssetsToQuestions(testKey, result.questions.length, PROJECT_ROOT);
  for (let i = 0; i < result.questions.length; i++) {
    result.questions[i].imageFile = assets[i];
  }
  
  console.log(`  ✅ Extracted ${result.questions.length} questions`);
  console.log(`  ✅ Answer key: ${Object.keys(result.answerKey).length} answers`);
  return result;
}

async function main() {
  console.log('🚀 Starting question extraction...\n');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const testFilter = args.find(a => a.startsWith('--test='))?.split('=')[1];
  
  const results = [];
  
  // Find all test files
  const pdfFiles = findPDFsInDir(TESTS_DIR);
  const docxFiles = findDOCXsInDir(TESTS_DIR);
  
  console.log(`Found ${pdfFiles.length} PDF(s) and ${docxFiles.length} DOCX(s)\n`);
  
  // Process PDFs
  for (const file of pdfFiles) {
    const testKey = inferTestKey(file);
    if (testFilter && testKey !== testFilter) continue;
    if (testKey !== 'unknown') {
      try {
        const result = await extractFromPDF(file, testKey);
        results.push(result);
      } catch (err) {
        console.error(`  ❌ Error processing ${file}:`, err);
      }
    }
  }
  
  // Process DOCXs
  for (const file of docxFiles) {
    const testKey = inferTestKey(file);
    if (testFilter && testKey !== testFilter) continue;
    if (testKey !== 'unknown') {
      try {
        const result = await extractFromDOCX(file, testKey);
        results.push(result);
      } catch (err) {
        console.error(`  ❌ Error processing ${file}:`, err);
      }
    }
  }
  
  if (results.length === 0) {
    console.log('⚠️  No test files processed');
    process.exit(1);
  }
  
  // Generate outputs
  console.log('\n📝 Generating output files...');
  generateJSONOutput(results, OUTPUT_JSON);
  generateTSOutput(results, OUTPUT_TS);
  
  console.log('\n✅ Extraction complete!');
  console.log(`   JSON: ${OUTPUT_JSON}`);
  console.log(`   TypeScript: ${OUTPUT_TS}`);
}

main().catch(console.error);