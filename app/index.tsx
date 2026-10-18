import { router } from 'expo-router';
import { ArrowRight, Check, ClipboardCheck, Clock3, Sparkles } from '@/utils/icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TestKey, tests } from '@/data/tests';

export default function TestSelectionScreen() {
  const [selectedTests, setSelectedTests] = useState<TestKey[]>([]);
  const [error, setError] = useState('');

  const toggleTest = (testKey: TestKey) => {
    setError('');
    setSelectedTests((current) =>
      current.includes(testKey)
        ? current.filter((key) => key !== testKey)
        : [...current, testKey]
    );
  };

  const continueToCandidate = () => {
    if (selectedTests.length === 0) {
      setError('Devam etmek için en az bir test seç.');
      return;
    }
    router.push({
      pathname: '/candidate',
      params: { testKeys: selectedTests.join(',') },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.kicker}>AKKO SINAV PORTALI</Text>
          <Text style={styles.title}>Mülakat testlerini seç</Text>
          <Text style={styles.subtitle}>
            Adaya verilecek testleri seçin. Seçilen sınavlar sırayla çözülecek ve
            son sınavdan sonra işlem tamamlanacaktır.
          </Text>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Sparkles size={22} color="#ffffff" />
          </View>
          <View style={styles.introCopy}>
            <Text style={styles.introTitle}>Birden fazla test seçebilirsiniz</Text>
            <Text style={styles.introText}>
              Örneğin Yönetsel ve Muhakeme testlerini birlikte atayabilirsiniz.
            </Text>
          </View>
        </View>

        {error ? (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.sectionTitle}>Mevcut testler</Text>

        {tests.map((test, index) => {
          const isSelected = selectedTests.includes(test.key);
          const order = selectedTests.indexOf(test.key);
          return (
            <Pressable
              key={test.key}
              style={({ pressed }) => [
                styles.testCard,
                isSelected && styles.testCardSelected,
                pressed && styles.testCardPressed,
              ]}
              onPress={() => toggleTest(test.key)}
              android_ripple={{ color: test.color }}
            >
              <View
                style={[
                  styles.checkbox,
                  isSelected && styles.checkboxSelected,
                ]}
              >
                {isSelected && (
                  <Check size={16} color="#ffffff" strokeWidth={3} />
                )}
              </View>

              <View
                style={[
                  styles.testIcon,
                  { backgroundColor: `${test.color}18` },
                ]}
              >
                <ClipboardCheck size={22} color={test.color} />
              </View>

              <View style={styles.testInfo}>
                <Text style={styles.testTitle}>{test.title}</Text>
                <Text style={styles.testDescription}>{test.description}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <ClipboardCheck size={13} color="#8c989f" />
                    <Text style={styles.metaText}>{test.questionCount} soru</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock3 size={13} color="#8c989f" />
                    <Text style={styles.metaText}>{test.duration}</Text>
                  </View>
                </View>
              </View>

              {isSelected && (
                <View
                  style={[
                    styles.orderBadge,
                    { backgroundColor: test.color },
                  ]}
                >
                  <Text style={styles.orderText}>{order + 1}</Text>
                </View>
              )}
            </Pressable>
          );
        })}

        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            selectedTests.length === 0 && styles.continueButtonDisabled,
            pressed && styles.continueButtonPressed,
          ]}
          onPress={continueToCandidate}
          disabled={selectedTests.length === 0}
        >
          <Text style={styles.continueButtonText}>Devam et</Text>
          <ArrowRight size={20} color="#ffffff" />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f5f7',
  },
  content: {
    padding: 24,
    paddingBottom: 40,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    marginBottom: 8,
  },
  kicker: {
    color: '#1e7d6b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  title: {
    color: '#0f1f2a',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: '#6b7a85',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 10,
  },
  introCard: {
    backgroundColor: '#0f1f2a',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 32,
    shadowColor: '#0f1f2a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 6,
  },
  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#eab308',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCopy: {
    flex: 1,
    marginLeft: 14,
  },
  introTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  introText: {
    color: '#94a8a0',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 4,
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 13,
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#0f1f2a',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 16,
  },
  testCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e9ed',
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 110,
    shadowColor: '#0f1f2a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  testCardSelected: {
    borderColor: '#1e7d6b',
    borderWidth: 2,
    backgroundColor: '#f0fdfa',
    shadowColor: '#1e7d6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  testCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#c3ccd0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    backgroundColor: '#ffffff',
  },
  checkboxSelected: {
    borderColor: '#1e7d6b',
    backgroundColor: '#1e7d6b',
  },
  testIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  testInfo: {
    flex: 1,
    marginRight: 12,
  },
  testTitle: {
    color: '#1a2a35',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  testDescription: {
    color: '#7b8992',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    color: '#8c989f',
    fontSize: 11,
    fontWeight: '700',
  },
  orderBadge: {
    width: 30,
    height: 30,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  orderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1e7d6b',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
    shadowColor: '#1e7d6b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  continueButtonDisabled: {
    backgroundColor: '#c3ccd0',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.97 }],
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
});