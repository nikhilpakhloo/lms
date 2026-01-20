import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from '@/lib/notifications';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Configure notifications handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listener for when user taps a notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      // Bonus: Navigate to Video page on tap if specific data or just default behavior
      router.push('/(tabs)/video');
    });

    return () => {
      responseListener.remove();
    };
  }, []);

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
