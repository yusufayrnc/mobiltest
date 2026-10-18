import * as fs from 'fs';
import * as path from 'path';

const TEST_PREFIXES: Record<string, string> = {
  operational: 'op',
  managerial: 'mg',
  spatial: 'sp',
  reasoning: 'rs'
};

const TEST_DIRS: Record<string, string> = {
  operational: 'op',
  managerial: 'mg',
  spatial: 'sp',
  reasoning: 'rs'
};

export function getAssetPrefix(testKey: string): string {
  return TEST_PREFIXES[testKey] || testKey.substring(0, 2);
}

export function getAssetDir(testKey: string): string {
  return TEST_DIRS[testKey] || testKey;
}

export function findExistingAssets(testKey: string, projectRoot: string): string[] {
  const dirName = getAssetDir(testKey);
  const assetDir = path.join(projectRoot, 'assets', 'tests', dirName);
  if (!fs.existsSync(assetDir)) return [];
  return fs.readdirSync(assetDir)
    .filter(f => f.toLowerCase().endsWith('.png') || f.toLowerCase().endsWith('.jpg'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.toString() || '0', 10);
      const numB = parseInt(b.match(/\d+/)?.toString() || '0', 10);
      return numA - numB;
    });
}

export function matchAssetsToQuestions(
  testKey: string,
  questionCount: number,
  projectRoot: string
): string[] {
  const prefix = getAssetPrefix(testKey);
  const existingAssets = findExistingAssets(testKey, projectRoot);
  const matched = [];
  for (let i = 1; i <= questionCount; i++) {
    const expectedName = prefix + '-' + i + '.png';
    const found = existingAssets.find(a => a.toLowerCase() === expectedName.toLowerCase());
    if (found) matched.push(found);
    else matched.push(expectedName);
  }
  return matched;
}

export function getImageRequirePath(testKey: string, imageFile: string): string {
  const dir = getAssetDir(testKey);
  return '../assets/tests/' + dir + '/' + imageFile;
}