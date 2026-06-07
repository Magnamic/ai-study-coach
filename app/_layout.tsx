import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { View, Image } from 'react-native';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

export default function RootLayout() {
  useFrameworkReady();

  return (
    <QueryClientProvider client={queryClient}>
      <View style={{ flex: 1, position: 'relative' }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        {/* Proud of UAE Badge - Fixed Top Right Corner */}
        <View
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 999,
            width: 100,
            height: 100,
          }}
        >
          <Image
            source={require('@/assets/proud-of-uae.png')}
            style={{
              width: '100%',
              height: '100%',
              resizeMode: 'contain',
            }}
          />
        </View>
        <StatusBar style="light" />
      </View>
    </QueryClientProvider>
  );
}
