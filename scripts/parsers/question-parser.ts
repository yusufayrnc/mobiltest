export interface ParsedQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: string;
  imageFile?: string;
}

export interface TestParseResult {
  testKey: string;
  questions: ParsedQuestion[];
  answerKey: Record<string, string>;
}

const TEST_PREFIXES: Record<string, string> = {
  operational: 'op',
  managerial: 'mg',
  spatial: 'sp',
  reasoning: 'rs'
};

function extractAnswerKey(text: string): Record<string, string> {
  const answerKey: Record<string, string> = {};
  
  // Pattern:  Cevap Anahtarı followed by lines like 1. c 2. a 3. c ...
  const answerSectionMatch = text.match(/Cevap Anahtar[ıi]\s*([\s\S]+)/i);
  if (!answerSectionMatch) return answerKey;

  const answerText = answerSectionMatch[1];
  
  // Match patterns like 1. c, 2. a, etc.
  const answerPattern = /(\d+)\.\s*([a-eA-E])/g;
  let match;
  while ((match = answerPattern.exec(answerText)) !== null) {
    const num = parseInt(match[1], 10);
    const letter = match[2].toLowerCase();
    const optionMap: Record<string, string> = { a: 'A', b: 'B', c: 'C', d: 'D', e: 'E' };
    answerKey[num.toString()] = optionMap[letter] || letter.toUpperCase();
  }

  // Also handle answer key format without numbers (just letters on lines)
  if (Object.keys(answerKey).length === 0) {
    const simplePattern = /^([A-E])\s*$/gim;
    let simpleMatch;
    let idx = 1;
    while ((simpleMatch = simplePattern.exec(answerText)) !== null && idx <= 25) {
      answerKey[idx.toString()] = simpleMatch[1].toUpperCase();
      idx++;
    }
  }

  return answerKey;
}

function cleanText(text: string): string {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

function isQuestionLine(line: string): boolean {
  const trimmed = line.trim();
  // Question indicators
  if (trimmed.includes('?')) return true;
  if (trimmed.match(/^(Aşağıdaki|Yukarıdaki|Yandaki|Verilen|Bir|Her|Bu|Şekilde|Soru)/i)) return true;
  if (trimmed.match(/^\d+\./)) return true; // Numbered
  return false;
}

function isOptionLine(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (trimmed.length > 120) return false; // Too long to be an option
  if (trimmed.includes('?')) return false; // Questions have ?
  if (isQuestionLine(trimmed)) return false;
  // Options are typically short phrases
  if (trimmed.length < 3) return false;
  // Skip section headers
  if (trimmed.toLowerCase().includes('bilgilere göre') ||
      trimmed.toLowerCase().includes('cevap anahtar') ||
      trimmed.toLowerCase().includes('sorularını cevaplayınız')) return false;
  return true;
}

function extractQuestionsFromPDF(text: string, testKey: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const prefix = TEST_PREFIXES[testKey] || testKey.substring(0, 2);
  
  // Expected question counts per test type
  const EXPECTED_COUNTS: Record<string, number> = {
    operational: 25,
    managerial: 25,
    spatial: 20,
    reasoning: 20
  };
  const maxQuestions = EXPECTED_COUNTS[testKey] || 25;
  
  // First, remove the answer key section and everything after it
  const answerKeyMatch = text.match(/Cevap Anahtar[ıi]\s*[\s\S]*/i);
  let questionText = text;
  if (answerKeyMatch) {
    questionText = text.substring(0, answerKeyMatch.index);
  }
  
  const questionBlocks = questionText.split(/(?=\n\d+\.\s)/);
  
  for (const block of questionBlocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;
    
    const numMatch = trimmed.match(/^(\d+)\.\s*(.+)/s);
    if (!numMatch) continue;
    
    const num = parseInt(numMatch[1], 10);
    const content = numMatch[2];
    
    // Skip if we've already got enough questions
    if (questions.length >= maxQuestions) continue;
    
    // Skip if it's the answer key section (shouldn't happen now but safety check)
    if (content.toLowerCase().includes('cevap anahtar')) continue;
    
    // Detect answer key blocks (multiple "N. X" patterns like "1. A 2. A 3. D")
    const answerKeyPattern = /(\d+)\.\s*[A-E]/g;
    const answerKeyMatches = content.match(answerKeyPattern);
    if (answerKeyMatches && answerKeyMatches.length >= 3) {
      continue;
    }
    
    const options: string[] = [];
    // Match both "a. text" and "A) text" formats
    // Also handle options on same line: "A) opt1 B) opt2 C) opt3 D) opt4"
    const optionPattern = /([a-eA-E])[.)]\s*([^a-eA-E]*?(?=\s*[a-eA-E][.)]|\s*$))/gi;
    let optMatch;
    const optionTexts: string[] = [];
    
    while ((optMatch = optionPattern.exec(content)) !== null) {
      const optText = optMatch[2].trim();
      if (optText.length > 0) {
        optionTexts.push(optText);
      }
    }
    
    // If we found options with text, use them; otherwise use default A-E
    if (optionTexts.length >= 2) {
      options.push(...optionTexts.slice(0, 5));
    } else {
      options.push('A', 'B', 'C', 'D', 'E');
    }
    
    let questionText = content;
    if (optionTexts.length > 0) {
      const firstOptIndex = content.indexOf(optionTexts[0]);
      if (firstOptIndex > 0) {
        questionText = content.substring(0, firstOptIndex).trim();
      }
    }
    
    questionText = questionText
      .replace(/OPERASYONEL BÖLÜM GENEL YETENEK TESTİ[\s\S]*?SAYFA NO: \d+ \/ \d+/gi, '')
      .replace(/YÖNETSEL BÖLÜM GENEL YETENEK TESTİ[\s\S]*?SAYFA NO: \d+ \/ \d+/gi, '')
      .replace(/ÜÇ BOYUTLU DÜŞÜNME TESTİ[\s\S]*?SAYFA NO: \d+ \/ \d+/gi, '')
      .replace(/P04\.T07\.F\d+-RV\.\d+-\d+\.\d+\.\d+/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    questionText = questionText.replace(/\s+\d+\s*$/, '').trim();
    
    if (questionText.length < 10) continue;
    
    questions.push({
      id: `${prefix}-${num}`,
      question: cleanText(questionText),
      options,
      imageFile: `${prefix}-${num}.png`
    });
  }
  
  return questions;
}

function extractQuestionsFromDOCX(text: string, testKey: string): ParsedQuestion[] {
  const questions: ParsedQuestion[] = [];
  const prefix = TEST_PREFIXES[testKey] || testKey.substring(0, 2);
  
  // Expected question counts per test type
  const EXPECTED_COUNTS: Record<string, number> = {
    operational: 25,
    managerial: 25,
    spatial: 20,
    reasoning: 20
  };
  const maxQuestions = EXPECTED_COUNTS[testKey] || 20;
  
  // Split into lines
  const lines = text.split('\n').map(l => l.trim()).filter(l => l);
  
  // Remove header/footer noise
  const filteredLines = lines.filter(line => {
    const lower = line.toLowerCase();
    if (lower.includes('sayfa no:')) return false;
    if (lower.includes('p04.t07')) return false;
    if (lower.includes('muhakeme test')) return false;
    return true;
  });
  
  // Detect section headers that should be prepended to following questions
  let currentSectionHeader = '';
  let currentQuestion: { text: string; options: string[] } | null = null;
  let questionNum = 1;
  let inAnswerKey = false;
  
  for (const line of filteredLines) {
    const lower = line.toLowerCase();
    
    // Check for answer key section
    if (lower.includes('cevap anahtar')) {
      inAnswerKey = true;
      continue;
    }
    if (inAnswerKey) continue;
    
    // Skip section headers (they apply to following questions)
    if (lower.includes('sorular') && lower.includes('cevaplayınız') ||
        lower.includes('bilgilere göre') && lower.includes('sorular')) {
      currentSectionHeader = line;
      continue;
    }
    
    // Check if this line looks like an option
    if (isOptionLine(line)) {
      if (currentQuestion) {
        currentQuestion.options.push(line);
      }
      continue;
    }
    
    // This looks like a question line
    if (isQuestionLine(line)) {
      // Save previous question if it has options
      if (currentQuestion && currentQuestion.options.length >= 2) {
        if (questions.length < maxQuestions) {
          let fullQuestion = currentQuestion.text;
          if (currentSectionHeader) {
            fullQuestion = currentSectionHeader + ' ' + fullQuestion;
          }
          questions.push({
            id: `${prefix}-${questionNum}`,
            question: cleanText(fullQuestion),
            options: currentQuestion.options.slice(0, 5),
            imageFile: `${prefix}-${questionNum}.png`
          });
          questionNum++;
        }
      }
      
      // Start new question
      currentQuestion = { text: line, options: [] };
    } else if (currentQuestion) {
      // Continuation of question text
      currentQuestion.text += ' ' + line;
    }
  }
  
  // Don't forget the last question
  if (currentQuestion && currentQuestion.options.length >= 2 && questions.length < maxQuestions) {
    let fullQuestion = currentQuestion.text;
    if (currentSectionHeader) {
      fullQuestion = currentSectionHeader + ' ' + fullQuestion;
    }
    questions.push({
      id: `${prefix}-${questionNum}`,
      question: cleanText(fullQuestion),
      options: currentQuestion.options.slice(0, 5),
      imageFile: `${prefix}-${questionNum}.png`
    });
  }
  
  return questions;
}

function extractQuestionsFromText(text: string, testKey: string): ParsedQuestion[] {
  // Try PDF-style numbered questions first
  const pdfQuestions = extractQuestionsFromPDF(text, testKey);
  if (pdfQuestions.length > 0) {
    return pdfQuestions;
  }
  
  // Fallback to DOCX-style unnumbered questions
  return extractQuestionsFromDOCX(text, testKey);
}

export function parseTestContent(text: string, fileName: string, testKey: string): TestParseResult {
  const answerKey = extractAnswerKey(text);
  const questions = extractQuestionsFromText(text, testKey);
  
  // Attach correct answers from answer key
  for (const q of questions) {
    const numMatch = q.id.match(/-(\d+)$/);
    if (numMatch) {
      const num = numMatch[1];
      if (answerKey[num]) {
        q.correctAnswer = answerKey[num];
      }
    }
  }
  
  return {
    testKey,
    questions,
    answerKey
  };
}

export function inferTestKey(fileName: string): string {
  const lower = fileName.toLowerCase();
  if (lower.includes('operasyonel') || lower.includes('operational')) return 'operational';
  if (lower.includes('yönetsel') || lower.includes('yonetsel') || lower.includes('managerial')) return 'managerial';
  if (lower.includes('boyutlu') || lower.includes('spatial') || lower.includes('3boyutlu')) return 'spatial';
  if (lower.includes('muhakeme') || lower.includes('reasoning')) return 'reasoning';
  return 'unknown';
}