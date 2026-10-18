import { router, useLocalSearchParams } from 'expo-router';
import { CheckCircle2 } from '@/utils/icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { getTest, calculateScore, TestKey } from '@/data/tests';
import LottieView from 'lottie-react-native';

type NextAttempt = { id: string; test_key: string; sequence_number: number };

export default function FinishScreen() {
  const { attemptId, answers, firstName, lastName, sessionId, nextAttempts, testKey } = useLocalSearchParams<{ attemptId: string; answers: string; firstName: string; lastName: string; sessionId: string; nextAttempts: string; testKey: string }>();
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [scoreData, setScoreData] = useState<{ score: number; correct: number; wrong: number; empty: number } | null>(null);

  const finishCurrentTest = async () => {
    setIsSaving(true);
    const parsedAnswers = answers ? JSON.parse(answers) : {};
    const test = getTest(testKey as TestKey);
    let score = 0;

    if (test) {
      const result = calculateScore(test.key, parsedAnswers);
      score = result.score;
      setScoreData(result);
    }

    const { error: updateError } = await supabase
      .from('test_attempts')
      .update({ status: 'completed', score, answers: parsedAnswers, submitted_at: new Date().toISOString() })
      .eq('id', attemptId);

    setIsSaving(false);
    if (updateError) {
      setError('Test sonucu kaydedilemedi. Lütfen tekrar dene.');
      return;
    }

    const upcomingAttempts: NextAttempt[] = nextAttempts ? JSON.parse(nextAttempts) : [];
    if (upcomingAttempts.length > 0) {
      const next = upcomingAttempts[0];
      router.replace({
        pathname: '/test',
        params: { testKey: next.test_key, attemptId: next.id, firstName, lastName, sessionId, nextAttempts: JSON.stringify(upcomingAttempts.slice(1)) },
      });
      return;
    }
    router.replace({ pathname: '/complete', params: { sessionId, firstName, lastName } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.successIcon}>
          <LottieView
            source={require('../assets/animations/success.json')}
            autoPlay
            loop={false}
            style={{ width: 80, height: 80 }}
          />
        </View>
        <Text style={styles.title}>Bu sınav tamamlandı</Text>
        <Text style={styles.subtitle}>
          {nextAttempts ? `${JSON.parse(nextAttempts).length} sınav daha var. Hazırsan sıradaki sınava geçebilirsin.` : 'Son sınavı da tamamladın.'}
        </Text>
        {scoreData && (
          <View style={styles.scoreCard}>
            <Text style={styles.scoreTitle}>Sınav Sonucun</Text>
            <View style={styles.scoreRow}>
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreValue, { color: '#2b8a72' }]}>{scoreData.correct}</Text>
                <Text style={styles.scoreLabel}>Doğru</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreValue, { color: '#b55545' }]}>{scoreData.wrong}</Text>
                <Text style={styles.scoreLabel}>Yanlış</Text>
              </View>
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreValue, { color: '#89959d' }]}>{scoreData.empty}</Text>
                <Text style={styles.scoreLabel}>Boş</Text>
              </View>
            </View>
            <View style={styles.totalScore}>
              <Text style={styles.totalLabel}>PUAN</Text>
              <Text style={[styles.totalValue, { color: testKey ? getTest(testKey as TestKey)?.color : '#e17a4d' }]}>{scoreData.score}</Text>
              <Text style={styles.outOf}>/ 100</Text>
            </View>
          </View>
        )}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {nextAttempts && JSON.parse(nextAttempts).length > 0 ? 'Sıradaki sınava geçmeye hazır mısın?' : 'Tüm sınavları tamamlamak üzeresin'}
          </Text>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} onPress={finishCurrentTest} disabled={isSaving}>
            <Text style={styles.buttonText}>
              {isSaving ? 'Hazırlanıyor...' : nextAttempts && JSON.parse(nextAttempts).length > 0 ? 'Diğer sınava geç' : 'Sınavları bitir'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7f9' },
  content: { flex: 1, justifyContent: 'center', padding: 24, maxWidth: 560, width: '100%', alignSelf: 'center' },
  successIcon: { width: 70, height: 70, borderRadius: 24, backgroundColor: '#e9f5f1', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 21 },
  title: { color: '#142a35', fontSize: 29, lineHeight: 35, fontWeight: '800', textAlign: 'center' },
  subtitle: { color: '#7b8992', fontSize: 14, lineHeight: 21, textAlign: 'center', marginTop: 10 },
  scoreCard: { backgroundColor: '#ffffff', borderRadius: 21, padding: 20, marginTop: 20, marginBottom: 10 },
  scoreTitle: { color: '#263c46', fontSize: 17, fontWeight: '800', marginBottom: 15, textAlign: 'center' },
  scoreRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 15 },
  scoreItem: { alignItems: 'center' },
  scoreValue: { fontSize: 28, fontWeight: '800' },
  scoreLabel: { color: '#89959d', fontSize: 11, fontWeight: '700', marginTop: 4 },
  totalScore: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 4, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#e5eaec' },
  totalLabel: { color: '#89959d', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  totalValue: { fontSize: 36, fontWeight: '800' },
  outOf: { color: '#a1abb1', fontSize: 14, marginBottom: 4 },
  card: { backgroundColor: '#ffffff', borderRadius: 21, padding: 20, marginTop: 10 },
  cardTitle: { color: '#263c46', fontSize: 17, fontWeight: '800', marginBottom: 17, textAlign: 'center' },
  error: { color: '#b55545', fontSize: 12, marginBottom: 12, textAlign: 'center' },
  button: { height: 53, borderRadius: 15, backgroundColor: '#e17a4d', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  buttonPressed: { opacity: 0.9, transform: [{ scale: 0.97 }] },
  buttonText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});