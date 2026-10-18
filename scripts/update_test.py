import re 
with open(r'C:\Users\konya\OneDrive\Desktop\project\app\test.tsx', 'r', encoding='utf-8') as f: 
    content = f.read() 
imports_end = content.find('export default function TestScreen()')  
helper = '''function getImageSource(testKey, imageFile):  
  if not imageFile: return None  
  dirMap = {  
    'operational': 'op',  
    'managerial': 'mg',  
    'spatial': 'sp',  
    'reasoning': 'rs'  
  }  
  dir = dirMap.get(testKey)  
  if not dir: return None  
  try:  
    return require('../assets/tests/' + dir + '/' + imageFile)  
  except:  
    return None  
''' 
content = content[:imports_end] + helper + content[imports_end:] 
content = content.replace( 
