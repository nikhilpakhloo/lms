import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import * as Sentry from '@sentry/react-native';
import * as Notifications from 'expo-notifications';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { registerForPushNotificationsAsync } from '@/lib/notifications';

const isProduction = !__DEV__;

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: isProduction ? 'production' : 'development',
  tracesSampleRate: isProduction ? 0.2 : 1.0,
  enableLogs: true,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: isProduction ? 0.1 : 0.1,
  integrations: [Sentry.mobileReplayIntegration()],
});

function SentryErrorFallback() {
  return (
    <View className="flex-1 items-center justify-center bg-background p-6">
      <Text variant="h3" className="text-center text-foreground">Something went wrong</Text>
      <Text className="mt-2 text-center text-muted-foreground">The error has been reported.</Text>
    </View>
  );
}

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

function RootLayout() {
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
    <Sentry.ErrorBoundary fallback={<SentryErrorFallback />}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);
