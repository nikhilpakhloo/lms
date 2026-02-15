import { Tabs } from 'expo-router';
import { Chrome, Clapperboard, Settings } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Icon } from '@/components/ui/icon';
import { NAV_THEME } from '@/lib/theme';

export default function setLayout() {
    const { colorScheme } = useColorScheme();
    const theme = NAV_THEME[colorScheme ?? 'light'];

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.primary,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                }
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Browser',
                    tabBarIcon: ({ color, size }) => <Icon as={Chrome} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="video"
                options={{
                    title: 'Player',
                    tabBarIcon: ({ color, size }) => <Icon as={Clapperboard} size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Icon as={Settings} size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
