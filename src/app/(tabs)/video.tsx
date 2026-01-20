import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useIsFocused } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Maximize, Pause, Play, Volume2, VolumeX } from 'lucide-react-native';
import { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';

const VIDEO_SOURCES = [
    { name: 'Default Stream', uri: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8' },
    { name: 'Big Buck Bunny', uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' },
    { name: 'Elephants Dream', uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
];

export default function VideoScreen() {
    const isFocused = useIsFocused();
    const ref = useRef<VideoView>(null);
    const [sourceIndex, setSourceIndex] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const player = useVideoPlayer(VIDEO_SOURCES[sourceIndex].uri, player => {
        player.loop = true;
        player.timeUpdateEventInterval = 0.1; // Enable time updates every 100ms
        player.play();
    });

    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        if (!isFocused) {
            player.pause();
        }
    }, [isFocused, player]);

    useEffect(() => {
        const playingSub = player.addListener('playingChange', payload => {
            setIsPlaying(payload.isPlaying);
        });

        const mutedSub = player.addListener('mutedChange', payload => {
            setIsMuted(payload.muted);
        });

        const statusSub = player.addListener('statusChange', payload => {
            if (payload.status === 'readyToPlay' && player.duration > 0) {
                setDuration(player.duration);
            }
        });

        // Track time updates
        const timeSub = player.addListener('timeUpdate', payload => {
            if (!isSeeking) {
                setCurrentTime(payload.currentTime);
            }
            // Update duration if it's currently 0
            if (duration === 0 && (payload as any).duration > 0) {
                setDuration((payload as any).duration);
            } else if (duration === 0 && player.duration > 0) {
                setDuration(player.duration);
            }
        });

        return () => {
            playingSub.remove();
            mutedSub.remove();
            timeSub.remove();
            statusSub.remove();
        };
    }, [player, isSeeking, duration]);

    const togglePlayback = () => {
        if (isPlaying) {
            player.pause();
        } else {
            player.play();
        }
    };

    const toggleMute = () => {
        player.muted = !isMuted;
    };

    const seekBackward = () => {
        player.seekBy(-10);
    };

    const seekForward = () => {
        player.seekBy(10);
    };

    const enterFullscreen = () => {
        if (ref.current) {
            ref.current.enterFullscreen();
        }
    };

    const switchSource = () => {
        const nextIndex = (sourceIndex + 1) % VIDEO_SOURCES.length;
        setSourceIndex(nextIndex);
        setCurrentTime(0);
        setDuration(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <SafeAreaView className="flex-1 bg-background justify-center">
            <View className="items-center justify-center p-4">
                <View className="mb-6 w-full items-center">
                    <Text variant="h3" className="text-center font-bold">HLS Video Player</Text>
                    <Text variant="small" className="text-muted-foreground mt-1">
                        Playing: {VIDEO_SOURCES[sourceIndex].name}
                    </Text>
                </View>

                {/* Video Container */}
                <View className="w-full aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-border">
                    <VideoView
                        ref={ref}
                        player={player}
                        style={{ width: '100%', height: '100%' }}
                        fullscreenOptions={{ enable: true }}
                        nativeControls={false}
                    />
                </View>

                {/* Progress Slider (Seek functionality) */}
                <View className="w-full mt-8 px-2">
                    <Slider
                        style={{ width: '100%', height: 40 }}
                        minimumValue={0}
                        maximumValue={duration}
                        value={currentTime}
                        minimumTrackTintColor="hsl(var(--primary))"
                        maximumTrackTintColor="hsl(var(--muted))"
                        thumbTintColor="hsl(var(--primary))"
                        onSlidingStart={() => setIsSeeking(true)}
                        onSlidingComplete={(value) => {
                            player.currentTime = value;
                            setIsSeeking(false);
                        }}
                    />
                    <View className="flex-row justify-between px-1 -mt-1">
                        <Text className="text-xs text-muted-foreground">{formatTime(currentTime)}</Text>
                        <Text className="text-xs text-muted-foreground">{formatTime(duration)}</Text>
                    </View>
                </View>

                {/* Main Controls */}
                <View className="w-full mt-4 gap-6">
                    <View className="flex-row items-center justify-around">
                        <Button variant="ghost" size="icon" onPress={toggleMute}>
                            <Icon as={isMuted ? VolumeX : Volume2} size={24} className="text-foreground" />
                        </Button>

                        <View className="flex-row items-center gap-6">
                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12" onPress={seekBackward}>
                                <Text className="font-bold">-10s</Text>
                            </Button>

                            <Button size="icon" className="w-16 h-16 rounded-full shadow-lg" onPress={togglePlayback}>
                                <Icon as={isPlaying ? Pause : Play} size={32} className="text-primary-foreground" />
                            </Button>

                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12" onPress={seekForward}>
                                <Text className="font-bold">+10s</Text>
                            </Button>
                        </View>

                        <Button variant="ghost" size="icon" onPress={enterFullscreen}>
                            <Icon as={Maximize} size={24} className="text-foreground" />
                        </Button>
                    </View>

                    {/* Source Switcher */}
                    <View className="px-4">
                        <Button variant="outline" className="w-full h-12 rounded-xl border-dashed" onPress={switchSource}>
                            <Text className="font-medium text-foreground">Switch Stream ({sourceIndex + 1}/{VIDEO_SOURCES.length})</Text>
                        </Button>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
