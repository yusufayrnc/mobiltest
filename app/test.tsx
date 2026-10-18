import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, ArrowRight, Check, LucideImage } from '@/utils/icons';
import { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, Image, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTest } from '@/data/tests';
import { getTestImageSource } from './utils/testImages';
import { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function TestScreen() {
  const { testKey, attemptId, firstName, lastName, sessionId, nextAttempts } = useLocalSearchParams<{ testKey: string; attemptId: string; firstName: string; lastName: string; sessionId: string; nextAttempts: string }>();
  const test = getTest(testKey);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  if (!test) return null;
  const question = test.questions[questionIndex];
  const isLastQuestion = questionIndex === test.questions.length - 1;
  const chooseAnswer = (answer: string) => setAnswers((current) => ({ ...current, [question.id]: answer }));
  const nextQuestion = () => {
    if (isLastQuestion) {
      router.push({
        pathname: '/finish',
        params: { testKey: test.key, attemptId, firstName, lastName, sessionId, nextAttempts, answers: JSON.stringify(answers) },
      });
    } else {
      setQuestionIndex((current) => current + 1);
    }
  };
  const prevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex((current) => current - 1);
    }
  };

  const progress = useSharedValue(-100);
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: `${progress.value}%` }],
  }));

  // Update progress when questionIndex changes
  useEffect(() => {
    const targetProgress = -100 + ((questionIndex + 1) / test.questions.length) * 100;
    progress.value = withTiming(targetProgress, { duration: 300, easing: (t) => t * (2 - t) });
  }, [questionIndex, test.questions.length]);

  const imageSource = getTestImageSource(test.key, question.imageUri as string | undefined);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
            <ArrowLeft size={18} color="#687780" />
            <Text style={styles.backText}>Çık</Text>
          </Pressable>
          <Text style={styles.counter}>{questionIndex + 1} / {test.questions.length}</Text>
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, progressAnimatedStyle, { backgroundColor: test.color as string }]} />
        </View>
        <Text style={styles.kicker}>{test.shortTitle.toUpperCase()}</Text>
        <Text style={styles.title}>Soru {questionIndex + 1}</Text>
        <View style={styles.questionCard}>
          <Text style={styles.question}>{question.question}</Text>
          {imageSource ? (
            <Image source={imageSource} style={styles.questionImage} resizeMode="contain" />
          ) : (
            <View style={styles.visualPlaceholder}>
              <LucideImage size={28} color="#72918c" />
              <Text style={styles.visualText}>GÖRSEL SORU</Text>
              <Text style={styles.visualSubtext}>Sorunun görseli burada görüntülenecek</Text>
            </View>
          )}
          <Text style={styles.chooseLabel}>Cevabını seç</Text>
          {question.options.map((option) => (
            <Pressable key={option} onPress={() => chooseAnswer(option)} style={({ pressed }) => [styles.option, answers[question.id] === option && { borderColor: test.color, backgroundColor: `${test.color}12` }, pressed && styles.optionPressed]}>
              <View style={[styles.radio, answers[question.id] === option && { borderColor: test.color, backgroundColor: test.color }]}>
                {answers[question.id] === option ? <Check size={13} color="#ffffff" strokeWidth={3} /> : null}
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </View>
        <View style={styles.navButtons}>
          <Pressable style={({ pressed }) => [styles.prevButton, questionIndex === 0 && styles.disabled, pressed && styles.navButtonPressed]} onPress={prevQuestion} disabled={questionIndex === 0}>
            <ArrowLeft size={20} color="#e17a4d" />
            <Text style={styles.prevText}>Önceki</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.nextButton, !answers[question.id] && styles.disabled, pressed && styles.navButtonPressed]} onPress={nextQuestion} disabled={!answers[question.id]}>
            <Text style={styles.nextText}>{isLastQuestion ? 'Testi bitir' : 'Sonraki soru'}</Text>
            <ArrowRight size={20} color="#ffffff" />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7f9' },
  content: { padding: 24, paddingBottom: 40, maxWidth: 650, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  back: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  backPressed: { opacity: 0.7, transform: [{ scale: 0.97 }] },
  backText: { color: '#687780', fontSize: 13, fontWeight: '700' },
  counter: { color: '#687780', fontSize: 13, fontWeight: '800' },
  progressTrack: { height: 7, borderRadius: 5, backgroundColor: '#e5eaec', marginTop: 17, overflow: 'hidden' },
  progressFill: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '100%', borderRadius: 5 },
  kicker: { color: '#2b8a72', fontSize: 11, letterSpacing: 1.4, fontWeight: '800', marginTop: 29 },
  title: { color: '#142a35', fontSize: 29, fontWeight: '800', marginTop: 8 },
  questionCard: { backgroundColor: '#ffffff', borderRadius: 21, padding: 19, marginTop: 18 },
  question: { color: '#263c46', fontSize: 18, lineHeight: 26, fontWeight: '800' },
  questionImage: { width: '100%', height: 200, borderRadius: 15, marginTop: 19, backgroundColor: '#eef3f3' },
  visualPlaceholder: { height: 145, borderRadius: 15, backgroundColor: '#eef3f3', alignItems: 'center', justifyContent: 'center', marginTop: 19 },
  visualText: { color: '#72918c', fontSize: 18, fontWeight: '800', letterSpacing: 1, marginTop: 8 },
  visualSubtext: { color: '#91a7a2', fontSize: 11, marginTop: 6 },
  chooseLabel: { color: '#89959d', fontSize: 12, fontWeight: '700', marginTop: 22, marginBottom: 9 },
  option: { height: 48, borderRadius: 13, borderWidth: 1, borderColor: '#e2e8e9', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, marginBottom: 9 },
  optionPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  radio: { width: 23, height: 23, borderRadius: 12, borderWidth: 1.5, borderColor: '#bbc5ca', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  optionText: { color: '#40525d', fontSize: 14, fontWeight: '800' },
  navButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 18 },
  prevButton: { height: 54, borderRadius: 15, backgroundColor: '#fff0e9', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 20 },
  nextButton: { height: 54, borderRadius: 15, backgroundColor: '#e17a4d', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, paddingHorizontal: 20 },
  disabled: { opacity: 0.45 },
  navButtonPressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  prevText: { color: '#e17a4d', fontSize: 14, fontWeight: '800' },
  nextText: { color: '#ffffff', fontSize: 14, fontWeight: '800' },
});