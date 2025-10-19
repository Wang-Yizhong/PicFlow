// app/components/PhotoDetailsModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, Text, View, Alert, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
// 使用 legacy 入口，兼容性好
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';

export type PicsumItem = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

type Props = {
  visible: boolean;
  item: PicsumItem | null;
  onClose: () => void;
};

export default function PhotoDetailsModal({ visible, item, onClose }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [loadingImg, setLoadingImg] = useState(true);
  const [imgUri, setImgUri] = useState<string | null>(null);

  // Modal 打开/切换图片时，准备 300x300 灰度图并预取
  useEffect(() => {
    if (item?.id) {
      const uri = `https://picsum.photos/id/${item.id}/300/300?grayscale`;
      setImgUri(uri);
      Image.prefetch(uri).catch(() => null);
      setLoadingImg(true);
    } else {
      setImgUri(null);
      setLoadingImg(true);
    }
  }, [item]);

  const onDownload = async () => {
    if (!item?.download_url) return;
    try {
      setDownloading(true);

      // 兼容旧 SDK：true 等价于 { writeOnly: true }
      const { status } = await MediaLibrary.requestPermissionsAsync(true);
      if (status !== 'granted') {
        Alert.alert(
          'Berechtigung erforderlich',
          'Bitte erlaube den Zugriff auf Fotos/Medien, um Bilder zu speichern.'
        );
        return;
      }

      const filename = `pic_${item.id}_${Date.now()}.jpg`;
      const dest = `${FileSystem.cacheDirectory}${filename}`;
      const res = await FileSystem.downloadAsync(item.download_url, dest);
      if (res.status !== 200) throw new Error(`Fehler beim Download (${res.status})`);

      const asset = await MediaLibrary.createAssetAsync(res.uri);
      await MediaLibrary.createAlbumAsync('PicFlow', asset, false);

      Alert.alert('Gespeichert', 'Das Bild wurde erfolgreich in der Galerie gespeichert.');
    } catch (e: any) {
      console.error('[Download Error]', e);
      Alert.alert('Download fehlgeschlagen', e?.message ?? 'Unbekannter Fehler');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View
        style={[
          tw`flex-1 justify-center p-4`,
          { backgroundColor: 'rgba(0,0,0,0.4)' }, // 任意色用内联更稳
        ]}
      >
        <View style={tw`bg-white rounded-2xl p-4`}>
          {/* 标题 + 关闭 */}
          <View style={tw`flex-row items-center justify-between mb-2`}>
            <Text style={tw`text-lg font-bold text-gray-900`}>
              {item?.author ?? 'Unbekannt'}
            </Text>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={tw`w-7 h-7 rounded-full bg-gray-200 items-center justify-center`}
            >
              <Text style={tw`text-base text-gray-900`}>✕</Text>
            </Pressable>
          </View>

          {/* 图片容器：主题色渐变占位 + 图片淡入 */}
          <View
            style={[
              tw`self-center items-center justify-center overflow-hidden rounded-xl`,
              { width: 300, height: 300 },
            ]}
          >
            {loadingImg && (
              <LinearGradient
                colors={['#4F46E5', '#06B6D4']} // primary → secondary
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[tw`absolute w-full h-full`]}
              />
            )}

            {imgUri && (
              <Image
                source={{ uri: imgUri }}
                style={{ width: 300, height: 300 }}
                contentFit="cover"
                cachePolicy="disk"
                transition={250}
                onLoadStart={() => setLoadingImg(true)}
                onLoadEnd={() => setLoadingImg(false)}
              />
            )}

            {loadingImg && (
              <ActivityIndicator size="large" color="#FFFFFF" style={tw`absolute`} />
            )}
          </View>

          {/* 文本信息 */}
          <View style={tw`mt-3`}>
            <Row label="Höhe" value={String(item?.height ?? '-')} />
            <Row label="Breite" value={String(item?.width ?? '-')} />

            <Text style={tw`text-gray-500 mt-2 mb-1`}>Download-URL</Text>
            <Text numberOfLines={1} style={tw`text-blue-500`}>
              {item?.download_url ?? '-'}
            </Text>
          </View>

          {/* 下载按钮 */}
          <Pressable
            onPress={onDownload}
            disabled={downloading || !item?.download_url}
            style={[
              tw`mt-5 bg-indigo-600 rounded-xl items-center py-3.5`,
              (downloading || !item?.download_url) && tw`opacity-70`,
            ]}
          >
            <Text style={tw`text-white font-bold text-base`}>
              {downloading ? 'Wird heruntergeladen…' : 'Bild herunterladen'}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={tw`flex-row justify-between mt-1.5`}>
      <Text style={tw`text-gray-500`}>{label}</Text>
      <Text style={tw`font-bold`}>{value}</Text>
    </View>
  );
}
