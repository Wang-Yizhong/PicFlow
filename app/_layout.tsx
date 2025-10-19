import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
// app/_layout.tsx  或 App.tsx
import twrnc from 'twrnc';

// 👇 全局注册一次
global.tw = twrnc;

// ✅ 现在所有页面都可以直接写 tw`bg-white p-4`


export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#201B7E' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="home" />
      </Stack>
    </>
  );
}
