// app/home.tsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import PhotoDetailsModal from './components/PhotoDetailsModal';

type PicsumItem = {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

const PAGE_SIZE = 10;

export default function HomeScreen() {
  // 状态
  const [items, setItems] = useState<PicsumItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 隐藏项
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const data = useMemo(() => items.filter(i => !hidden.has(i.id)), [items, hidden]);

  // 首屏阶段禁用触底，拖动后再允许
  const [canLoadMore, setCanLoadMore] = useState(false);

  // Modal
  const [selected, setSelected] = useState<PicsumItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 拉取数据
  async function fetchPage(
    targetPage: number,
    replace = false,
    kind: 'initial' | 'more' | 'refresh' = 'initial'
  ) {
    try {
      setError(null);
      if (kind === 'initial') setLoadingInitial(true);
      if (kind === 'more') setLoadingMore(true);

      const res = await fetch(
        `https://picsum.photos/v2/list?page=${targetPage}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error('Netzwerkfehler');
      const list: PicsumItem[] = await res.json();

      setHasMore(list.length === PAGE_SIZE);
      setItems(prev => (replace ? list : [...prev, ...list]));
      setPage(targetPage);
    } catch (e: any) {
      setError(e?.message || 'Laden fehlgeschlagen');
    } finally {
      if (kind === 'initial') setLoadingInitial(false);
      if (kind === 'more') setLoadingMore(false);
    }
  }

  useEffect(() => {
    fetchPage(1, true, 'initial');
  }, []);

  // 事件
  const onHide = (id: string) => setHidden(prev => new Set([...prev, id]));
  const onOpen = (item: PicsumItem) => {
    setSelected(item);
    setModalVisible(true);
  };

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    fetchPage(page + 1, false, 'more');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPage(1, true, 'initial');
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: PicsumItem }) => {
    const thumb = `https://picsum.photos/id/${item.id}/800/480`;
    return (
      <View style={{ ...tw`bg-white rounded-3xl overflow-hidden mb-4`, elevation: 1 }}>
        {/* 打开详情 */}
        <Pressable onPress={() => onOpen(item)}>
          <Image
            source={{ uri: thumb }}
            // h-52 ≈ 208px，接近你之前的 200
            style={tw`w-full h-52`}
            contentFit="cover"
            transition={220}
            placeholder={['#ECECEC']}
          />
        </Pressable>

        <View style={tw`flex-row items-center justify-between px-4 py-3`}>
          <Pressable onPress={() => onOpen(item)} style={tw`flex-1 pr-3`}>
            <Text numberOfLines={1} style={tw`text-base font-semibold text-gray-900`}>
              {item.author}
            </Text>
          </Pressable>

          <Pressable onPress={() => onHide(item.id)} style={tw`px-3 py-1.5 rounded-full bg-gray-100`}>
            <Text style={tw`text-xs text-gray-700`}>Ausblenden</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={tw`flex-1`} /* 背景自定义色 */>
      <View style={{ ...tw`flex-1`, backgroundColor: '#201B7E' }}>
        {/* Header：pt-14(≈56), pb-3(≈12), px-5(≈20) */}
        <View style={tw`pt-14 pb-3 px-5`}>
          <Text style={tw`text-white text-2xl font-extrabold`}>PicFlow</Text>
        </View>

        <FlatList
          data={data}
          keyExtractor={it => String(it.id)}
          renderItem={renderItem}
          contentContainerStyle={tw`p-4 pb-8`}
          initialNumToRender={10}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#fff"
              title="Aktualisieren..."
              titleColor="#fff"
            />
          }
          onScrollBeginDrag={() => setCanLoadMore(true)}
          onEndReachedThreshold={0.4}
          onEndReached={() => {
            if (!loadingInitial && data.length > 0 && canLoadMore && !loadingMore && hasMore) {
              loadMore();
              setCanLoadMore(false);
            }
          }}
          ListEmptyComponent={
            loadingInitial ? (
              <View style={tw`pt-20 items-center`}>
                <ActivityIndicator />
                <Text style={tw`text-white mt-2`}>Fotos werden geladen…</Text>
              </View>
            ) : error ? (
              <View style={tw`pt-20 items-center`}>
                <Text style={tw`text-white`}>
                  Laden fehlgeschlagen. Zum Aktualisieren nach unten ziehen.
                </Text>
              </View>
            ) : null
          }
          ListFooterComponent={
            loadingInitial || data.length === 0 ? null : (
              <View style={tw`py-6 items-center`}>
                {loadingMore ? <ActivityIndicator /> : null}
                {!hasMore && !loadingMore ? (
                  <Text style={tw`text-white opacity-70`}>Keine weiteren Bilder</Text>
                ) : null}
              </View>
            )
          }
        />
      </View>

      {/* 详情 Modal */}
      <PhotoDetailsModal
        visible={modalVisible}
        item={selected}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
