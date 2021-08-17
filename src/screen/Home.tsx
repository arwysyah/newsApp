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
} from 'react-native';
import axios, {AxiosResponse} from 'axios';
import {url, token} from './config/index';
import {INews} from './utils/index';
import moment from 'moment';
const {height, width} = Dimensions.get('window');
const spacing: number = 12;
const SIZE: number = width * 0.62;
const HEIGHT: number = SIZE - 90;
const Home: FC = () => {
  const [dataNews, setDataNews] = useState<INews[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const [text, setText] = useState<String>('');
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    setLoading(true);
    axios
      .get(url + token)
      .then((response: AxiosResponse) => setDataNews(response.data.articles))
      .then(() => setLoading(false))
      .catch(err => ToastAndroid.show(err.message, ToastAndroid.SHORT));
  };
  const filterData: INews[] = dataNews.filter(item => {
    return item.title.toLowerCase().indexOf(text.toLowerCase()) !== -1;
  });
  console.log(dataNews);
  return (
    <>
      <View>
        <FlatList
          data={filterData}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{alignItems: 'center'}}
          bounces={false}
          scrollEventThrottle={60}
          decelerationRate={0}
          renderItem={({item}: any) => {
            return (
              <View style={{height: HEIGHT + 3, width: width}}>
                {!loading ? (
                  <View style={styles.cardContainer}>
                    <View style={{width: width * 0.8}}>
                      <TouchableOpacity
                        // onPress={() =>
                        //   navigation.navigate('Details', {
                        //     item: item,
                        //   })
                        // }
                        style={{width: width * 0.6}}>
                        <Text style={{color: 'white'}}>{item.author}</Text>
                        <Text
                          style={{
                            color: 'white',
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
                          <Text style={{color: 'white'}} numberOfLines={1}>
                            {item.description}
                          </Text>
                          <Text style={{color: 'white', fontSize: 10}}>
                            {moment(item.publishedAt).format('LL')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{alignItems: 'center', top: 20, marginLeft: -130}}>
                      <TouchableOpacity
                      // onPress={() =>
                      //   navigation.navigate('Details', {
                      //     item: item,
                      //   })
                      // }
                      >
                        <Image
                          source={{uri: item.urlToImage}}
                          resizeMode="cover"
                          style={{height: 150, width: 100, borderRadius: 6}}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View>
                    <ActivityIndicator size="small" color="red" />
                  </View>
                )}
              </View>
            );
          }}
        />
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
  starsItem: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  horizontalStar: {
    height: 22,
    flexDirection: 'row',

    alignItems: 'center',
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
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
    width: width * 0.8,

    shadowOffset: {
      width: -3,
      height: -2,
    },
    elevation: -4,
    alignItems: 'center',
    alignSelf: 'center',
    height: 40,
    marginTop: 40,
    paddingBottom: 10,
  },
  cardContainer: {
    backgroundColor: 'black',
    opacity: 0.8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    height: HEIGHT,
    // borderRadius: 8,
    borderWidth: 0.3,
    borderColor: '#cfcfcf',
  },
});
export default Home;
