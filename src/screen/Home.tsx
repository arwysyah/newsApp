import React, {FC, useEffect, useState} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Animated,
  TextInput,
} from 'react-native';
import axios, {AxiosResponse} from 'axios';
import {url, token} from './config/index';
import {INews} from './utils/index';
import moment from 'moment';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Stacks} from '../screen/utils/index';
import {useSelector, useDispatch} from 'react-redux';
import {SET_GET_DATA} from '../redux/action';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, Stacks.home>;
};
const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const {width} = Dimensions.get('window');
const spacing: number = 12;
const SIZE: number = width * 0.62;
const HEIGHT: number = SIZE - 90;
const Home: FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState<Boolean>(true);
  const [text, setText] = useState<String>('');
  const [loadingList, setLoadingList] = useState<Boolean>(false);
  const [itemToRender, setItemToRender] = useState<number>(8);
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 150);
  const dispatch = useDispatch();
  const globalState = useSelector(state => state);

  const listData: INews[] = Object.values(globalState.data);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -80],
  });
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    setLoading(true);
    axios
      .get(url + token)
      .then((response: AxiosResponse) =>
        dispatch(SET_GET_DATA(response.data.articles)),
      )
      .then(() => setLoading(false))
      .catch(err => ToastAndroid.show(err.message, ToastAndroid.SHORT));
  };
  const filterData: INews[] = listData?.filter((item: INews) => {
    return item.title.toLowerCase().indexOf(text.toLowerCase()) !== -1;
  });
  const handleScroll = (e: any): void => {
    const length: number = listData?.length;
    const scrollPosition = e.nativeEvent.contentOffset.y;
    const scrollViewHeight = e.nativeEvent.layoutMeasurement.height;
    const contentHeight = e.nativeEvent.contentSize.height;
    const isScrolledBottom = scrollViewHeight + scrollPosition;
    if (isScrolledBottom >= contentHeight - 50 && itemToRender <= length) {
      setTimeout(() => {
        setItemToRender(itemToRender + 7);
        setLoadingList(true);
      });
    } else {
      setLoadingList(false);
    }
  };

  const renderItem = ({item, index}: any): any => {
    if (index + 1 <= itemToRender) {
      return (
        <View style={{height: HEIGHT + 3, width: width, top: 70}}>
          {!loading ? (
            <View style={styles.cardContainer}>
              <View style={{width: width * 0.8}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Details', {
                      item: item,
                    })
                  }
                  style={{width: width * 0.6}}>
                  <Text style={{color: 'black'}}>{item.author}</Text>
                  <Text
                    style={{
                      color: 'black',
                      fontWeight: 'bold',
                      top: 10,
                    }}
                    numberOfLines={1}>
                    {item.title}
                  </Text>
                </TouchableOpacity>

                <View style={{width: HEIGHT * 1.8}}></View>

                <View style={{top: spacing * 3, width: width * 0.6}}>
                  <TouchableOpacity
                    style={{width: width * 0.6}}
                    onPress={() =>
                      navigation.navigate('Details', {
                        item: item,
                      })
                    }>
                    <Text style={{color: 'black'}} numberOfLines={1}>
                      {item.description}
                    </Text>
                    <Text style={{color: 'black', fontSize: 14, top: 30}}>
                      {moment(item.publishedAt).format('LLLL')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{alignItems: 'center', top: 20, marginLeft: -130}}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('Details', {
                      item: item,
                    })
                  }>
                  <Image
                    source={{uri: item.urlToImage}}
                    resizeMode="cover"
                    style={styles.image}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <ActivityIndicator size="small" color="red" />
            </View>
          )}
          <View style={{height: 40}}></View>
        </View>
      );
    }
  };
  return (
    <>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.animatedView,
            {
              transform: [{translateY: translateY}],
            },
          ]}>
          {/* <Ionicons
            name="search"
            size={22}
            color={'#5C5C66'}
            style={styles.icon}
          /> */}
          <View style={{alignItems: 'center'}}>
            <TextInput
              keyboardType={'default'}
              onChangeText={txt => setText(txt)}
              style={[styles.textInputContact, {backgroundColor: '#ebebeb'}]}
              value={text}
            />
          </View>
        </Animated.View>
        <View style={{top: 10}}></View>
        {loadingList === true ? (
          <ActivityIndicator
            style={{bottom: 50, position: 'absolute', zIndex: 9}}
            size="large"
            color="#D23B4B"
          />
        ) : null}
        <View>
          {!loading ? (
            <View>
              {filterData?.length > 0 ? (
                <AnimatedFlatlist
                  data={filterData}
                  scrollEventThrottle={16}
                  onMomentumScrollEnd={e => handleScroll(e)}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{
                    alignItems: 'center',
                  }}
                  bounces={false}
                  decelerationRate={0}
                  initialNumToRender={4}
                  onScroll={e =>
                    scrollY.setValue(e.nativeEvent.contentOffset.y)
                  }
                  renderItem={renderItem}
                />
              ) : (
                <Text style={{color: 'black'}}>Data Not Found</Text>
              )}
            </View>
          ) : (
            <View>
              <ActivityIndicator size="large" color={'red'} />
            </View>
          )}
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  parentStarRate: {
    marginLeft: 145,
    top: -110,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexWrap: 'wrap',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },

  button: {
    height: 30,
    borderRadius: 7,
    width: 60,
    marginTop: 10,
    backgroundColor: '#EE6492',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputContact: {
    height: 40,

    width: width / 1.4,
    borderColor: 'grey',

    borderWidth: 0.2,
    borderRadius: 2,
    paddingLeft: 50,
    alignSelf: 'center',
  },
  cardContainer: {
    backgroundColor: 'white',
    opacity: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: HEIGHT,
    // borderRadius: 8,
    borderWidth: 0.3,
    borderColor: '#cfcfcf',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    height: 150,
    width: 100,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  searchStockStyle: {
    height: 40,

    width: width / 1.4,
    borderColor: 'grey',

    borderWidth: 0.2,
    borderRadius: 2,
    paddingLeft: 50,
  },
  animatedView: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    top: 14,
    zIndex: 10,
    // paddingBottom: 20,
  },
});
export default Home;
