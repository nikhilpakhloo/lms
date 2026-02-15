import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { setAppIcon, getAppIcon } from '@mozzius/expo-dynamic-app-icon';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { useCallback, useEffect, useState } from 'react';
import { View, Image, AppState, type AppStateStatus } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const APP_ICON_NAMES = [null, 'appstore', 'social'] as const;
const LABELS = ['Default', 'App Store', 'Social'];

const APP_ICON_IMAGES: Record<string, number> = {
    Default: require('@/assets/images/icon.png'),
    appstore: require('@/assets/images/app-store.png'),
    social: require('@/assets/images/social.png'),
};

function getIconImageSource(index: number): number {
    const name = APP_ICON_NAMES[index];
    return APP_ICON_IMAGES[name ?? 'Default'] ?? APP_ICON_IMAGES.Default;
}

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

export default function SettingsScreen() {
    const [index, setIndex] = useState(0);

    const refreshNativeIcon = useCallback(() => {
        if (isExpoGo) return;
        try {
            const name = getAppIcon();
            const resolved = name === 'DEFAULT' ? null : name;
            const i = APP_ICON_NAMES.indexOf(resolved as (typeof APP_ICON_NAMES)[number]);
            if (i >= 0) setIndex(i);
        } catch {}
    }, []);

    useEffect(() => { refreshNativeIcon(); }, [refreshNativeIcon]);

    useEffect(() => {
        const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
            if (state === 'active') refreshNativeIcon();
        });
        return () => sub.remove();
    }, [refreshNativeIcon]);

    const changeLogo = () => {
        const nextIndex = (index + 1) % APP_ICON_NAMES.length;
        setIndex(nextIndex);

        if (!isExpoGo) {
            const next = APP_ICON_NAMES[nextIndex];
            try {
                setAppIcon(next as Parameters<typeof setAppIcon>[0]);
            } catch {}
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="flex-1 items-center justify-center px-6">
                <Text variant="h2" className="mb-2 text-foreground">Settings</Text>
                <Text variant="small" className="mb-8 text-muted-foreground">
                    Change the app logo
                </Text>

                <View className="mb-6 h-24 w-24 items-center justify-center rounded-2xl border-2 border-border bg-card">
                    <Image
                        source={getIconImageSource(index)}
                        style={{ width: 72, height: 72 }}
                        resizeMode="contain"
                    />
                </View>
                <Text variant="small" className="mb-4 text-muted-foreground">
                    Current: {LABELS[index]}
                </Text>

                {isExpoGo ? (
                    <Text className="mb-6 text-center text-sm text-muted-foreground">
                        In Expo Go only the in-app logo changes. Use a dev build to try launcher icon change.
                    </Text>
                ) : (
                    <Text className="mb-6 text-center text-sm text-muted-foreground">
                        Logo updates here immediately. Home screen icon may also update after you press Home (depends on device).
                    </Text>
                )}

                <Button
                    onPress={changeLogo}
                    className="min-w-48 rounded-xl"
                >
                    <Text className="font-semibold text-primary-foreground">Change logo</Text>
                </Button>
            </View>
        </SafeAreaView>
    );
}
