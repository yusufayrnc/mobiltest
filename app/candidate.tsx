import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Mail, UserRound } from '@/utils/icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTest, TestKey, tests } from '@/data/tests';
import { supabase } from '@/lib/supabase';

export default function CandidateScreen() {
  const { testKeys } = useLocalSearchParams<{ testKeys: string }>();
  const selectedKeys = (testKeys ?? '').split(',').filter((key): key is TestKey => tests.some((test) => test.key === key));
  const selectedTests = selectedKeys.map((key) => getTest(key)).filter((test) => test !== undefined);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startTests = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) { setError('Lütfen tüm alanları doldur.'); return; }
    if (!email.includes('@')) { setError('Geçerli bir e-posta adresi gir.'); return; }
    if (selectedTests.length === 0) { setError('En az bir test seçilmelidir.'); return; }
    setIsSaving(true);
    const sessionId = crypto.randomUUID();
    const rows = selectedTests.map((test, index) => ({ session_id: sessionId, sequence_number: index + 1, test_key: test.key, first_name: firstName.trim(), last_name: lastName.trim(), email: email.trim().toLowerCase(), answers: {}, status: 'in_progress' }));
    const { data, error: insertError } = await supabase.from('test_attempts').insert(rows).select('id, test_key, sequence_number');
    setIsSaving(false);
    if (insertError || !data || data.length !== selectedTests.length) { setError('Sınav oturumu başlatılamadı. Lütfen tekrar dene.'); return; }
    const attempts = [...data].sort((a, b) => a.sequence_number - b.sequence_number);
    const firstAttempt = attempts[0];
    const nextAttempts = attempts.slice(1);
    router.push({ pathname: '/test', params: { testKey: firstAttempt.test_key, attemptId: firstAttempt.id, firstName: firstName.trim(), lastName: lastName.trim(), sessionId, nextAttempts: JSON.stringify(nextAttempts) } });
  };

  if (selectedTests.length === 0) return null;
  return <SafeAreaView style={styles.safeArea} edges={['top']}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Pressable style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]} onPress={() => router.back()}><ArrowLeft size={18} color="#687780" /><Text style={styles.backText}>Test seçimine dön</Text></Pressable><Text style={styles.kicker}>ADAY BİLGİLERİ</Text><Text style={styles.title}>Sınava başlamadan önce</Text><Text style={styles.subtitle}>Sonuç belgesinde yer alması için bilgileri eksiksiz doldur.</Text><View style={styles.testInfo}><Text style={styles.testInfoTitle}>{selectedTests.length} testlik oturum</Text><Text style={styles.testMeta}>{selectedTests.map((test, index) => `${index + 1}. ${test?.shortTitle}`).join('  ·  ')}</Text></View><View style={styles.formCard}><Text style={styles.formTitle}>Aday bilgileri</Text><Text style={styles.label}>Ad</Text><View style={styles.inputWrapper}><UserRound size={18} color="#748091" /><TextInput value={firstName} onChangeText={(value) => { setFirstName(value); setError(''); }} placeholder="Ad" placeholderTextColor="#9aa4b2" style={styles.input} /></View><Text style={styles.label}>Soyad</Text><View style={styles.inputWrapper}><UserRound size={18} color="#748091" /><TextInput value={lastName} onChangeText={(value) => { setLastName(value); setError(''); }} placeholder="Soyad" placeholderTextColor="#9aa4b2" style={styles.input} /></View><Text style={styles.label}>E-posta adresi</Text><View style={styles.inputWrapper}><Mail size={18} color="#748091" /><TextInput value={email} onChangeText={(value) => { setEmail(value); setError(''); }} placeholder="ornek@mail.com" placeholderTextColor="#9aa4b2" keyboardType="email-address" autoCapitalize="none" style={styles.input} /></View>{error ? <Text style={styles.error}>{error}</Text> : null}<Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={startTests} disabled={isSaving}><Text style={styles.buttonText}>{isSaving ? 'Hazırlanıyor...' : 'Teste başla'}</Text><ArrowRight size={20} color="#ffffff" /></Pressable></View></ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: '#f5f7f9' }, content: { padding: 24, paddingBottom: 40, maxWidth: 650, width: '100%', alignSelf: 'center' }, backButton: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 27 }, backButtonPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] }, backText: { color: '#687780', fontSize: 13, fontWeight: '700' }, kicker: { color: '#2b8a72', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 }, title: { color: '#142a35', fontSize: 29, lineHeight: 35, fontWeight: '800' }, subtitle: { color: '#7b8992', fontSize: 14, lineHeight: 21, marginTop: 9 }, testInfo: { backgroundColor: '#163d3a', borderRadius: 18, padding: 17, marginTop: 24 }, testInfoTitle: { color: '#ffffff', fontSize: 15, fontWeight: '800' }, testMeta: { color: '#b9d4cc', fontSize: 12, lineHeight: 19, marginTop: 7 }, formCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 19, marginTop: 16 }, formTitle: { color: '#142a35', fontSize: 18, fontWeight: '800', marginBottom: 19 }, label: { color: '#344551', fontSize: 12, fontWeight: '700', marginBottom: 7, marginTop: 13 }, inputWrapper: { height: 50, borderRadius: 13, borderWidth: 1, borderColor: '#e1e7eb', backgroundColor: '#fafbfc', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 9 }, input: { flex: 1, height: '100%', color: '#142a35', fontSize: 14 }, error: { color: '#b55545', fontSize: 12, marginTop: 13 }, button: { height: 53, borderRadius: 15, backgroundColor: '#e17a4d', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 22 }, pressed: { opacity: .82, transform: [{ scale: 0.97 }] }, buttonText: { color: '#ffffff', fontSize: 14, fontWeight: '800' } });
