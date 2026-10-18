import { Tabs } from 'expo-router';
import { ClipboardCheck, UserRound } from 'lucide-react-native';

export default function TabsLayout() {
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: '#e17a4d', tabBarInactiveTintColor: '#9aa6ad', tabBarLabelStyle: { fontSize: 11, fontWeight: '700', marginBottom: 4 }, tabBarStyle: { height: 68, paddingTop: 8, borderTopColor: '#e8edef', backgroundColor: '#ffffff' } }}><Tabs.Screen name="index" options={{ title: 'Testler', tabBarIcon: ({ color, size }) => <ClipboardCheck color={color} size={size} /> }} /><Tabs.Screen name="profile" options={{ title: 'Profil', tabBarIcon: ({ color, size }) => <UserRound color={color} size={size} /> }} /><Tabs.Screen name="tests" options={{ href: null }} /></Tabs>;
}
