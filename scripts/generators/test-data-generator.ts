import * as fs from 'fs';
import * as path from 'path';
import { ParsedQuestion, TestParseResult } from '../parsers/question-parser';

export interface TestDefinition {
  key: string;
  title: string;
  shortTitle: string;
  description: string;
  questionCount: number;
  duration: string;
  color: string;
  questions: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  imageUri?: string;
}

const TEST_METADATA: Record<string, Omit<TestDefinition, 'key' | 'questions'>> = {
  operational: {
    title: 'Operasyonel Bölüm Genel Yetenek Testi',
    shortTitle: 'Operasyonel Bölüm',
    description: 'Görsel dikkat ve mantık',
    questionCount: 25,
    duration: '20 dk',
    color: '#e17a4d'
  },
  managerial: {
    title: 'Yönetsel Bölüm Genel Yetenek Testi',
    shortTitle: 'Yönetsel Bölüm',
    description: 'Analitik düşünme ve yorumlama',
    questionCount: 25,
    duration: '25 dk',
    color: '#2b8a72'
  },
  spatial: {
    title: 'Üç Boyutlu Düşünme Testi',
    shortTitle: 'Üç Boyutlu Düşünme',
    description: 'Uzamsal algı ve şekil çözümleme',
    questionCount: 20,
    duration: '20 dk',
    color: '#6d7ea6'
  },
  reasoning: {
    title: 'Muhakeme Testi',
    shortTitle: 'Muhakeme',
    description: 'Mantıksal çıkarım ve problem çözme',
    questionCount: 20,
    duration: '20 dk',
    color: '#c28a42'
  }
};

export function generateTestDefinition(result: TestParseResult): TestDefinition {
  const meta = TEST_METADATA[result.testKey] || {
    title: result.testKey,
    shortTitle: result.testKey,
    description: '',
    questionCount: result.questions.length,
    duration: '20 dk',
    color: '#000000'
  };

  const questions: TestQuestion[] = result.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswer: q.correctAnswer,
    imageUri: q.imageFile
  }));

  return {
    key: result.testKey,
    ...meta,
    questionCount: questions.length,
    questions
  };
}

export function generateJSONOutput(results: TestParseResult[], outputPath: string): void {
  const output: Record<string, TestDefinition> = {};
  
  for (const result of results) {
    output[result.testKey] = generateTestDefinition(result);
  }
  
  const json = JSON.stringify(output, null, 2);
  fs.writeFileSync(outputPath, json, 'utf-8');
  console.log('✅ JSON output written to: ' + outputPath);
}

export function generateTSOutput(results: TestParseResult[], outputPath: string): void {
  const tests: TestDefinition[] = results.map(r => generateTestDefinition(r));
  
  let tsContent = '// Auto-generated from PDF/DOCX extraction\n';
  tsContent += '// Do not edit manually - run `npm run extract:all` to regenerate\n\n';
  tsContent += 'export type TestKey = "operational" | "managerial" | "spatial" | "reasoning";\n\n';
  tsContent += 'export type TestQuestion = {\n';
  tsContent += '  id: string;\n';
  tsContent += '  question: string;\n';
  tsContent += '  options: string[];\n';
  tsContent += '  correctAnswer?: string;\n';
  tsContent += '  imageUri?: string | number;\n';
  tsContent += '};\n\n';
  tsContent += 'export type TestDefinition = {\n';
  tsContent += '  key: TestKey;\n';
  tsContent += '  title: string;\n';
  tsContent += '  shortTitle: string;\n';
  tsContent += '  description: string;\n';
  tsContent += '  questionCount: number;\n';
  tsContent += '  duration: string;\n';
  tsContent += '  color: string;\n';
  tsContent += '  questions: TestQuestion[];\n';
  tsContent += '};\n\n';

  for (const t of tests) {
    tsContent += 'const ' + t.key + 'Questions: TestQuestion[] = ' + JSON.stringify(t.questions, null, 2) + ';\n\n';
  }

  tsContent += 'export const tests: TestDefinition[] = [\n';
  for (const t of tests) {
    tsContent += '  {\n';
    tsContent += '    key: ' + JSON.stringify(t.key) + ',\n';
    tsContent += '    title: ' + JSON.stringify(t.title) + ',\n';
    tsContent += '    shortTitle: ' + JSON.stringify(t.shortTitle) + ',\n';
    tsContent += '    description: ' + JSON.stringify(t.description) + ',\n';
    tsContent += '    questionCount: ' + t.questionCount + ',\n';
    tsContent += '    duration: ' + JSON.stringify(t.duration) + ',\n';
    tsContent += '    color: ' + JSON.stringify(t.color) + ',\n';
    tsContent += '    questions: ' + t.key + 'Questions,\n';
    tsContent += '  },\n';
  }
  tsContent += '];\n\n';

  tsContent += 'export function getTest(testKey: string | string[] | undefined): TestDefinition | undefined {\n';
  tsContent += '  const key = Array.isArray(testKey) ? testKey[0] : testKey;\n';
  tsContent += '  return tests.find((test) => test.key === key);\n';
  tsContent += '}\n\n';

  tsContent += 'export function calculateScore(testKey: TestKey, answers: Record<string, string>): { score: number; correct: number; wrong: number; empty: number } {\n';
  tsContent += '  const test = getTest(testKey);\n';
  tsContent += '  if (!test) return { score: 0, correct: 0, wrong: 0, empty: 0 };\n\n';
  tsContent += '  let correct = 0;\n';
  tsContent += '  let wrong = 0;\n';
  tsContent += '  let empty = 0;\n\n';
  tsContent += '  test.questions.forEach((q) => {\n';
  tsContent += '    const userAnswer = answers[q.id];\n';
  tsContent += '    if (!userAnswer) {\n';
  tsContent += '      empty++;\n';
  tsContent += '    } else if (q.correctAnswer && userAnswer.toLowerCase() === q.correctAnswer.toLowerCase()) {\n';
  tsContent += '      correct++;\n';
  tsContent += '    } else {\n';
  tsContent += '      wrong++;\n';
  tsContent += '    }\n';
  tsContent += '  });\n\n';
  tsContent += '  const score = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 100) : 0;\n\n';
  tsContent += '  return { score, correct, wrong, empty };\n';
  tsContent += '}\n';

  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log('✅ TypeScript output written to: ' + outputPath);
}