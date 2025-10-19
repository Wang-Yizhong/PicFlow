// app/splash.tsx 或 app/(root)/splash.tsx
import React, { useEffect } from 'react';
import { Image, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
// 注意：按你的项目结构调整路径，比如从 app/ 出发：'../lib/tw'
import tw from '../lib/tw';

export default function SplashScreenInner() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      router.replace('/home');
    }, 3000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <LinearGradient
      // 使用你在 tailwind.config.js 中的主题色（这里仍以十六进制传入）
      colors={['#201B7E', '#4F46E5', '#06B6D4']}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      style={tw`flex-1 items-center justify-center`}
    >
      <View style={tw`items-center`}>
        <Image
          // 注意：按你的实际层级调整图标路径。若文件在 app/，默认 Expo 模板图标通常在 ../assets/
          source={require('../assets/icon.png')}
          style={tw`w-32 h-32 rounded-3xl`}
          resizeMode="contain"
        />
        <Text style={tw`text-white text-3xl font-extrabold mt-4`}>PicFlow</Text>
      </View>
    </LinearGradient>
  );
}
