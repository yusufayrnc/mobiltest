import { router } from 'expo-router';
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, Layers3, Timer, FileText } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { tests, TestDefinition } from '@/data/tests';

type Attempt = { id: string; test_key: string; score: number | null; status: string; submitted_at: string | null; sequence_number: number };

export default function TestsScreen() {
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      const { data, error } = await supabase
        .from('test_attempts')
        .select('id, test_key, score, status, submitted_at, sequence_number')
        .order('submitted_at', { ascending: false });
      if (error) throw error;
      setAttempts(data as Attempt[]);
    } catch (e) {
      console.error('Failed to fetch attempts:', e);
    } finally {
      setLoading(false);
    }
  };

  const getTestStatus = (testKey: string) => {
    const testAttempts = attempts.filter((a) => a.test_key === testKey);
    if (testAttempts.length === 0) return { status: 'Başlamadı', score: '—' as string | number };
    const completed = testAttempts.find((a) => a.status === 'completed');
    if (completed) return { status: 'Tamamlandı', score: completed.score ?? 0 };
    return { status: 'Devam ediyor', score: '—' as string | number };
  };

  const testIcons: Record<string, typeof FileText> = {
    operational: FileText,
    managerial: Layers3,
    spatial: Timer,
    reasoning: ClipboardCheck,
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e17a4d" />
        </View>
      </SafeAreaView>
    );
  }

  const completedCount = attempts.filter((a) => a.status === 'completed').length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]} onPress={() => router.push('/(tabs)')}>
          <ArrowLeft size={18} color="#687780" />
          <Text style={styles.backText}>Özete dön</Text>
        </Pressable>
        <Text style={styles.kicker}>TESTLERİM</Text>
        <Text style={styles.title}>Sınav sonuçların</Text>
        <Text style={styles.subtitle}>Tamamladığın testleri ve mevcut durumunu buradan inceleyebilirsin.</Text>

        <View style={styles.summary}>
          <View>
            <Text style={styles.summaryLabel}>TOPLAM TEST</Text>
            <Text style={styles.summaryValue}>{tests.length}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View>
            <Text style={styles.summaryLabel}>TAMAMLANAN</Text>
            <Text style={styles.summaryValue}>{completedCount}</Text>
          </View>
          <View style={styles.summaryIcon}>
            <CheckCircle2 size={27} color="#2b8a72" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Tüm testler</Text>
        {tests.map((test: TestDefinition) => {
          const Icon = testIcons[test.key] || FileText;
          const { status, score } = getTestStatus(test.key);
          return (
            <View style={styles.testCard} key={test.key}>
              <View style={[styles.testIcon, { backgroundColor: `${test.color}18` }]}>
                <Icon size={21} color={test.color} />
              </View>
              <View style={styles.testInfo}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testSubtitle}>{test.questionCount} soru · {test.description}</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: status === 'Tamamlandı' ? '#2b8a72' : status === 'Devam ediyor' ? '#e17a4d' : '#b0b9bf' }]} />
                  <Text style={styles.status}>{status}</Text>
                </View>
              </View>
              <View style={styles.testResult}>
                <Text style={[styles.testScore, { color: test.color }]}>{score}</Text>
                {score !== '—' ? <Text style={styles.outOf}>/100</Text> : null}
              </View>
              <ArrowRight size={18} color="#a5afb5" />
            </View>
          );
        })}

        <View style={styles.note}>
          <Text style={styles.noteTitle}>Not</Text>
          <Text style={styles.noteText}>Test sonuçları sınav tamamlandığında otomatik olarak güncellenir.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7f9' },
  content: { padding: 24, paddingBottom: 35, maxWidth: 650, width: '100%', alignSelf: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 27 },
  backButtonPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  backText: { color: '#687780', fontSize: 13, fontWeight: '700' },
  kicker: { color: '#2b8a72', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 8 },
  title: { color: '#142a35', fontSize: 29, fontWeight: '800' },
  subtitle: { color: '#7b8992', fontSize: 14, lineHeight: 21, marginTop: 9, maxWidth: 420 },
  summary: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 19, padding: 17, marginTop: 24, marginBottom: 29 },
  summaryLabel: { color: '#9aa5ac', fontSize: 10, letterSpacing: 0.7, fontWeight: '800' },
  summaryValue: { color: '#142a35', fontSize: 25, fontWeight: '800', marginTop: 4 },
  summaryDivider: { width: 1, height: 37, backgroundColor: '#e6eaec', marginHorizontal: 24 },
  summaryIcon: { marginLeft: 'auto', width: 45, height: 45, borderRadius: 15, backgroundColor: '#e9f5f1', alignItems: 'center', justifyContent: 'center' },
  sectionTitle: { color: '#142a35', fontSize: 18, fontWeight: '800', marginBottom: 13 },
  testCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 15, marginBottom: 11, flexDirection: 'row', alignItems: 'center', minHeight: 92 },
  testIcon: { width: 43, height: 43, borderRadius: 14, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  testInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  testTitle: { color: '#263c46', fontSize: 13, lineHeight: 18, fontWeight: '800' },
  testSubtitle: { color: '#929da4', fontSize: 11, marginTop: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 4 },
  status: { color: '#87939a', fontSize: 10, fontWeight: '700' },
  testResult: { alignItems: 'flex-end', marginRight: 11 },
  testScore: { fontSize: 21, fontWeight: '800' },
  outOf: { color: '#a1abb1', fontSize: 10, marginTop: 1 },
  note: { backgroundColor: '#fff7db', borderRadius: 16, padding: 15, marginTop: 11 },
  noteTitle: { color: '#896d18', fontSize: 12, fontWeight: '800', marginBottom: 5 },
  noteText: { color: '#9a812f', fontSize: 12, lineHeight: 18 },
});