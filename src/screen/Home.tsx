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
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {countryCode} from './utils/countryCode';
import axios, {AxiosResponse} from 'axios';
import {url, token} from './config/index';
import {INews} from './utils/index';
import moment from 'moment';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList, Stacks} from '../screen/utils/index';
import {useSelector, useDispatch} from 'react-redux';
import {SET_GET_DATA} from '../redux/action';

import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
type Props = {
  navigation: StackNavigationProp<RootStackParamList, Stacks.home>;
};
const AnimatedFlatlist = Animated.createAnimatedComponent(FlatList);
const {height, width} = Dimensions.get('window');
const spacing: number = 12;
const SIZE: number = width * 0.62;
const HEIGHT: number = SIZE - 90;

const Home: FC<Props> = ({navigation}) => {
  const [loading, setLoading] = useState<Boolean>(true);
  const [text, setText] = useState<String>('');
  const [country, setCountry] = useState<String>('us');
  const [loadingList, setLoadingList] = useState<Boolean>(false);
  const [itemToRender, setItemToRender] = useState<number>(8);
  const scrollY = new Animated.Value(0);
  const diffClamp = Animated.diffClamp(scrollY, 0, 150);
  const dispatch = useDispatch();
  const globalState = useSelector(state => state);
  const [isModalVisible, setModalVisible] = useState(false);

  const listData: INews[] = Object.values(globalState.data);
  const translateY = diffClamp.interpolate({
    inputRange: [0, 80],
    outputRange: [0, -80],
  });
  useEffect(() => {
    fetchNews(country);
  }, []);

  const fetchNews = (params: String) => {
    setLoading(true);

    axios
      .get(url + params + '&' + 'category=technology&apiKey=' + token)
      .then((response: AxiosResponse) =>
        dispatch(SET_GET_DATA(response.data.articles)),
      )
      .then(() => setLoading(false))
      .catch(err => ToastAndroid.show(err.message, ToastAndroid.SHORT));
    setModalVisible(false);
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
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TextInput
              keyboardType={'default'}
              onChangeText={txt => setText(txt)}
              style={[styles.textInputContact, {backgroundColor: '#ebebeb'}]}
              value={text}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{width: 60}}>
              <MaterialCommunity
                name="arrow-down-drop-circle"
                size={28}
                color={'#5C5C66'}
                style={styles.icon}
              />
            </TouchableOpacity>
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
        {isModalVisible == true && (
          <Modal
            transparent={true}
            isVisible={isModalVisible}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View style={styles.wrapper}>
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.countryWrapper}>
                  <View
                    style={{
                      height: 40,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 20,
                        color: '#000',
                      }}>
                      Country List
                    </Text>
                  </View>
                  <ScrollView style={{marginTop: 10}}>
                    {countryCode.map((data, index) => (
                      <View key={index}>
                        <TouchableOpacity
                          onPress={() => {
                            setCountry(data);
                            fetchNews(data);
                          }}
                          key={index}
                          style={{
                            flexDirection: 'row',
                            // padding: 8,
                            height: 25,
                            left: width / 4.2,
                          }}>
                          <Text
                            style={[
                              {
                                fontSize: 14,
                                color: data == country ? 'red' : 'black',
                                textAlign: 'center',
                              },
                            ]}>
                            {data.toUpperCase()}
                          </Text>

                          {/* <Image source={require('./../../assets/chevronForward.png')} /> */}
                        </TouchableOpacity>
                        <View style={styles.footer} />
                      </View>
                    ))}
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      flex: 1,
                      justifyContent: 'flex-end',
                      marginBottom: 12,
                    }}>
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </Modal>
        )}
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
  footer: {
    height: 0.5,
    backgroundColor: '#CACAD8',
    width: width * 0.9,
    justifyContent: 'center',
    marginTop: 5,
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
  wrapper: {
    backgroundColor: '#000000aa',
    alignItems: 'center',
    // flex: 1,
    justifyContent: 'center',
    // alignSelf: 'center',
    height: height * 1.1,
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
  cancelText: {
    textAlign: 'center',
    color: '#D23B4B',
    fontSize: 17,
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
  icon: {
    position: 'absolute',
    zIndex: 99,
    left: 10,
    top: 5,
  },
  countryWrapper: {
    height: height / 1.5,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.5,
    borderRadius: 20,
  },
});
export default Home;
