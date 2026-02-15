import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { scheduleLocalNotification } from '@/lib/notifications';
import * as Sentry from '@sentry/react-native';
import { useRef, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { ChevronLeft, ChevronRight, RotateCw } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function WebViewScreen() {
    const webViewRef = useRef<WebView>(null);
    const [loaded, setLoaded] = useState(false);
    const [loadingOne, setLoadingOne] = useState(false);
    const [loadingTwo, setLoadingTwo] = useState(false);

    // Navigation state
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);

    const sentryTestCountRef = useRef(0);

    const handleLoadEnd = () => {
        if (!loaded) {
            scheduleLocalNotification('Apple website loaded 🍎', 'The content is ready for you to view!');
            setLoaded(true);
        }
    };

    const onNavigationStateChange = (navState: any) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    const triggerNotificationOne = () => {
        setLoadingOne(true);
        scheduleLocalNotification('iPhone 16: Price Drop! 📉', 'Grab yours now at a discounted price.', 2);
        setTimeout(() => setLoadingOne(false), 2000);
    };

    const triggerNotificationTwo = () => {
        setLoadingTwo(true);
        scheduleLocalNotification('iPhone 17: Now Live! 🚀', 'Experience the future of mobile today.', 5);
        setTimeout(() => setLoadingTwo(false), 5000);
    };

    const goBack = () => webViewRef.current?.goBack();
    const goForward = () => webViewRef.current?.goForward();
    const reload = () => webViewRef.current?.reload();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View className="flex-1 bg-background">
                {/* Top Navigation Toolbar */}
                <View className="flex-row items-center justify-between px-4 py-2 border-b border-border bg-card">
                    <View className="flex-row gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onPress={goBack}
                            disabled={!canGoBack}
                            className={!canGoBack ? 'opacity-30' : ''}
                        >
                            <Icon as={ChevronLeft} size={24} className="text-foreground" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onPress={goForward}
                            disabled={!canGoForward}
                            className={!canGoForward ? 'opacity-30' : ''}
                        >
                            <Icon as={ChevronRight} size={24} className="text-foreground" />
                        </Button>
                    </View>
                    <Button variant="ghost" size="icon" onPress={reload}>
                        <Icon as={RotateCw} size={20} className="text-foreground" />
                    </Button>
                </View>

                {/* Delay Notification Overlay Buttons + Sentry Test */}
                <View
                    className="absolute bottom-6 left-0 right-0 z-10 flex-row flex-wrap justify-center gap-4 px-4"
                    pointerEvents="box-none"
                >
                    <Button
                        onPress={triggerNotificationOne}
                        disabled={loadingOne}
                        className="h-12 w-32 rounded-full shadow-lg border border-border bg-background/80"
                        variant="secondary"
                    >
                        {loadingOne ? (
                            <ActivityIndicator size="small" color="hsl(var(--foreground))" />
                        ) : (
                            <Text className="font-bold">2s Delay</Text>
                        )}
                    </Button>

                    <Button
                        onPress={triggerNotificationTwo}
                        disabled={loadingTwo}
                        className="h-12 w-32 rounded-full shadow-lg border border-border bg-background/80"
                        variant="secondary"
                    >
                        {loadingTwo ? (
                            <ActivityIndicator size="small" color="hsl(var(--foreground))" />
                        ) : (
                            <Text className="font-bold">5s Delay</Text>
                        )}
                    </Button>

                    <Button
                        onPress={() => {
                            sentryTestCountRef.current += 1;
                            const n = sentryTestCountRef.current;
                            Sentry.withScope((scope) => {
                                scope.setFingerprint(['test-sentry', String(n)]);
                                Sentry.captureException(new Error(`Test Sentry #${n}`));
                            });
                        }}
                        className="h-12 rounded-full shadow-lg border border-border bg-background/80"
                        variant="secondary"
                    >
                        <Text className="font-bold">Test Sentry</Text>
                    </Button>
                </View>

                {/* Full-screen WebView */}
                <View className="flex-1">
                    <WebView
                        ref={webViewRef}
                        source={{ uri: 'https://www.apple.com/in/' }}
                        style={{ flex: 1 }}
                        onLoadEnd={handleLoadEnd}
                        onNavigationStateChange={onNavigationStateChange}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        startInLoadingState={true}
                        scalesPageToFit={true}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}
