// src/components/ImageCard.tsx
import React from 'react';
import { Image, Pressable, View, Text } from 'react-native';

export type ImageItem = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

type Props = {
  item: ImageItem;
  onOpen: (item: ImageItem) => void; // 点击图片/作者 → 进入详情
  onHide: (id: string) => void;      // 仅点击按钮 → 隐藏
};

export default function ImageCard({ item, onOpen, onHide }: Props) {
  const thumb = `https://picsum.photos/id/${item.id}/800/480`;

  return (
    <View className="bg-white rounded-3xl overflow-hidden mb-4 shadow-sm">
      {/* 点击图片 => 打开详情（不隐藏） */}
      <Pressable onPress={() => onOpen(item)}>
        <Image source={{ uri: thumb }} style={{ width: '100%', height: 200 }} resizeMode="cover" />
      </Pressable>

      <View className="flex-row items-center justify-between px-4 py-3">
        {/* 点击作者 => 打开详情 */}
        <Pressable onPress={() => onOpen(item)} className="flex-1 pr-3">
          <Text className="text-lg font-semibold" numberOfLines={1}>
            {item.author}
          </Text>
        </Pressable>

        {/* 只有点按钮才隐藏 */}
        <Pressable onPress={() => onHide(item.id)} className="px-3 py-1 rounded-full bg-gray-100">
          <Text className="text-sm text-gray-700">Hide</Text>
        </Pressable>
      </View>
    </View>
  );
}
