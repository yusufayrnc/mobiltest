// Static image imports for Metro bundler compatibility
// This avoids dynamic require() which doesn't work with Metro

const opImages: Record<string, any> = {
  'op-1.png': require('../../assets/tests/op/op-1.png'),
  'op-2.png': require('../../assets/tests/op/op-2.png'),
  'op-3.png': require('../../assets/tests/op/op-3.png'),
  'op-4.png': require('../../assets/tests/op/op-4.png'),
  'op-5.png': require('../../assets/tests/op/op-5.png'),
  'op-6.png': require('../../assets/tests/op/op-6.png'),
  'op-7.png': require('../../assets/tests/op/op-7.png'),
  'op-8.png': require('../../assets/tests/op/op-8.png'),
  'op-9.png': require('../../assets/tests/op/op-9.png'),
  'op-10.png': require('../../assets/tests/op/op-10.png'),
  'op-11.png': require('../../assets/tests/op/op-11.png'),
  'op-12.png': require('../../assets/tests/op/op-12.png'),
  'op-13.png': require('../../assets/tests/op/op-13.png'),
  'op-14.png': require('../../assets/tests/op/op-14.png'),
  'op-15.png': require('../../assets/tests/op/op-15.png'),
  'op-16.png': require('../../assets/tests/op/op-16.png'),
  'op-17.png': require('../../assets/tests/op/op-17.png'),
  'op-18.png': require('../../assets/tests/op/op-18.png'),
  'op-19.png': require('../../assets/tests/op/op-19.png'),
  'op-20.png': require('../../assets/tests/op/op-20.png'),
  'op-21.png': require('../../assets/tests/op/op-21.png'),
  'op-22.png': require('../../assets/tests/op/op-22.png'),
  'op-23.png': require('../../assets/tests/op/op-23.png'),
  'op-24.png': require('../../assets/tests/op/op-24.png'),
  'op-25.png': require('../../assets/tests/op/op-25.png'),
};

const mgImages: Record<string, any> = {
  'mg-1.png': require('../../assets/tests/mg/mg-1.png'),
  'mg-2.png': require('../../assets/tests/mg/mg-2.png'),
  'mg-3.png': require('../../assets/tests/mg/mg-3.png'),
  'mg-4.png': require('../../assets/tests/mg/mg-4.png'),
  'mg-5.png': require('../../assets/tests/mg/mg-5.png'),
  'mg-6.png': require('../../assets/tests/mg/mg-6.png'),
  'mg-7.png': require('../../assets/tests/mg/mg-7.png'),
  'mg-8.png': require('../../assets/tests/mg/mg-8.png'),
  'mg-9.png': require('../../assets/tests/mg/mg-9.png'),
  'mg-10.png': require('../../assets/tests/mg/mg-10.png'),
  'mg-11.png': require('../../assets/tests/mg/mg-11.png'),
  'mg-12.png': require('../../assets/tests/mg/mg-12.png'),
  'mg-13.png': require('../../assets/tests/mg/mg-13.png'),
  'mg-14.png': require('../../assets/tests/mg/mg-14.png'),
  'mg-15.png': require('../../assets/tests/mg/mg-15.png'),
  'mg-16.png': require('../../assets/tests/mg/mg-16.png'),
  'mg-17.png': require('../../assets/tests/mg/mg-17.png'),
  'mg-18.png': require('../../assets/tests/mg/mg-18.png'),
  'mg-19.png': require('../../assets/tests/mg/mg-19.png'),
  'mg-20.png': require('../../assets/tests/mg/mg-20.png'),
  'mg-21.png': require('../../assets/tests/mg/mg-21.png'),
  'mg-22.png': require('../../assets/tests/mg/mg-22.png'),
  'mg-23.png': require('../../assets/tests/mg/mg-23.png'),
  'mg-24.png': require('../../assets/tests/mg/mg-24.png'),
  'mg-25.png': require('../../assets/tests/mg/mg-25.png'),
};

const spImages: Record<string, any> = {
  'sp-1.png': require('../../assets/tests/sp/sp-1.png'),
  'sp-2.png': require('../../assets/tests/sp/sp-2.png'),
  'sp-3.png': require('../../assets/tests/sp/sp-3.png'),
  'sp-4.png': require('../../assets/tests/sp/sp-4.png'),
  'sp-5.png': require('../../assets/tests/sp/sp-5.png'),
  'sp-6.png': require('../../assets/tests/sp/sp-6.png'),
  'sp-7.png': require('../../assets/tests/sp/sp-7.png'),
  'sp-8.png': require('../../assets/tests/sp/sp-8.png'),
  'sp-9.png': require('../../assets/tests/sp/sp-9.png'),
  'sp-10.png': require('../../assets/tests/sp/sp-10.png'),
  'sp-11.png': require('../../assets/tests/sp/sp-11.png'),
  'sp-12.png': require('../../assets/tests/sp/sp-12.png'),
  'sp-13.png': require('../../assets/tests/sp/sp-13.png'),
  'sp-14.png': require('../../assets/tests/sp/sp-14.png'),
  'sp-15.png': require('../../assets/tests/sp/sp-15.png'),
  'sp-16.png': require('../../assets/tests/sp/sp-16.png'),
  'sp-17.png': require('../../assets/tests/sp/sp-17.png'),
  'sp-18.png': require('../../assets/tests/sp/sp-18.png'),
  'sp-19.png': require('../../assets/tests/sp/sp-19.png'),
  'sp-20.png': require('../../assets/tests/sp/sp-20.png'),
};

const rsImages: Record<string, any> = {};

export const testImageMap: Record<string, Record<string, any>> = {
  operational: opImages,
  managerial: mgImages,
  spatial: spImages,
  reasoning: rsImages,
};

export function getTestImageSource(testKey: string, imageFile?: string): any {
  if (!imageFile) return null;
  const images = testImageMap[testKey];
  if (!images) return null;
  return images[imageFile] || null;
}