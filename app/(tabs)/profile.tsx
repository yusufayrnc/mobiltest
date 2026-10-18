import { router } from 'expo-router';
import { Bell, ChevronRight, LogOut, ShieldCheck, UserRound } from 'lucide-react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.kicker}>HESABIM</Text>
        <Text style={styles.title}>Profil ve ayarlar</Text>
        <View style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>A</Text></View><View><Text style={styles.name}>Akko Kullanıcısı</Text><Text style={styles.username}>@akko</Text></View></View>
        <Text style={styles.sectionTitle}>Tercihler</Text>
        <View style={styles.menuCard}><Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}><View style={styles.menuIcon}><Bell size={18} color="#e17a4d" /></View><Text style={styles.menuLabel}>Bildirimler</Text><ChevronRight size={18} color="#a5afb5" /></Pressable><View style={styles.divider} /><Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}><View style={styles.menuIcon}><ShieldCheck size={18} color="#2b8a72" /></View><Text style={styles.menuLabel}>Gizlilik ve güvenlik</Text><ChevronRight size={18} color="#a5afb5" /></Pressable><View style={styles.divider} /><Pressable style={({ pressed }) => [styles.menuRow, pressed && styles.menuRowPressed]}><View style={styles.menuIcon}><UserRound size={18} color="#6d7ea6" /></View><Text style={styles.menuLabel}>Kullanıcı bilgileri</Text><ChevronRight size={18} color="#a5afb5" /></Pressable></View>
        <Pressable style={({ pressed }) => [styles.logoutButton, pressed && styles.logoutButtonPressed]} onPress={() => router.replace('/')}><LogOut size={18} color="#b55545" /><Text style={styles.logoutText}>Oturumu kapat</Text></Pressable>
        <Text style={styles.footer}>AKKO Sınav Portalı · İlk sürüm</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f7f9' },
  content: { padding: 24, flex: 1, maxWidth: 650, width: '100%', alignSelf: 'center' },
  kicker: { color: '#2b8a72', fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginTop: 12, marginBottom: 8 },
  title: { color: '#142a35', fontSize: 29, fontWeight: '800' },
  profileCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 18, flexDirection: 'row', alignItems: 'center', marginTop: 25, marginBottom: 30 },
  avatar: { width: 58, height: 58, borderRadius: 20, backgroundColor: '#e17a4d', alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarText: { color: '#ffffff', fontSize: 25, fontWeight: '800' },
  name: { color: '#263c46', fontSize: 16, fontWeight: '800' },
  username: { color: '#96a1a8', fontSize: 13, marginTop: 5 },
  sectionTitle: { color: '#142a35', fontSize: 18, fontWeight: '800', marginBottom: 13 },
  menuCard: { backgroundColor: '#ffffff', borderRadius: 18, paddingHorizontal: 15 },
  menuRow: { minHeight: 65, flexDirection: 'row', alignItems: 'center' },
  menuRowPressed: { opacity: 0.7, transform: [{ scale: 0.98 }] },
  menuIcon: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#f5f7f9', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  menuLabel: { flex: 1, color: '#40525d', fontSize: 14, fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#eef1f2' },
  logoutButton: { height: 52, borderRadius: 15, borderWidth: 1, borderColor: '#f0d1ca', flexDirection: 'row', gap: 9, alignItems: 'center', justifyContent: 'center', marginTop: 24 },
  logoutButtonPressed: { opacity: 0.8, transform: [{ scale: 0.97 }] },
  logoutText: { color: '#b55545', fontSize: 14, fontWeight: '800' },
  footer: { color: '#a0aab0', fontSize: 11, textAlign: 'center', marginTop: 'auto', marginBottom: 12 },
});
