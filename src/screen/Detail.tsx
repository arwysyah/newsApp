import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';

import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import {RootStackParamList, Stacks} from '../screen/utils/index';
import {StackNavigationProp} from '@react-navigation/stack';
const TOP: number = 24;
const spacing: number = 12;
import moment from 'moment';
export type Props = {
  navigation: StackNavigationProp<RootStackParamList, Stacks.home>;
  route: StackNavigationProp<RootStackParamList, Stacks.home>;
};
const {height, width} = Dimensions.get('window');
const Detail: React.FC<Props> = ({navigation, route}) => {
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const {item}: any = route.params;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  });

  return (
    <ScrollView style={styles.container}>
      {isLoading === true ? (
        <View>
          <ActivityIndicator size="large" color={'red'} />
        </View>
      ) : (
        <View>
          <View>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backIconContainer, {marginTop: 10}]}>
              <MaterialCommunity name="arrow-left" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={{height: 50}} />
          <View style={{paddingHorizontal: 20}}>
            <Text style={[styles.titleWrite, {textAlign: 'center'}]}>
              {item.title}
            </Text>
            <View style={styles.wrapper}>
              <Text style={styles.smallText}>{item.author} </Text>
              <Text style={styles.smallText}>
                {moment(item.release_date).format('YYYY-MM-DD')}
              </Text>
              {/* <Text style={styles.smallText}>{item.vote_average}</Text> */}
            </View>
            <View style={{height: 10}} />
            <View style={{alignSelf: 'center'}}>
              <Image
                style={{
                  width: width * 0.7,
                  height: height * 0.5,
                  borderRadius: 5,
                }}
                resizeMode="contain"
                source={{uri: item.urlToImage}}
              />
            </View>
            <View style={{top: spacing}}>
              {/* <Text style={[styles.titleTextName, {textAlign: 'justify'}]}>
                {item.title}
              </Text> */}
            </View>
          </View>
          <View style={styles.imageWrapper}>
            <Image
              style={{height: 50, width: 50, borderRadius: 40}}
              source={{uri: item.urlToImage}}
            />
            <View style={{paddingLeft: 20}}>
              <Text style={styles.smallText}>Written by</Text>
              <Text>
                <Text style={styles.titleTextName}>{item.author}</Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={{marginTop: 30, padding: 20}}
            onPress={() => Linking.openURL(item.url)}>
            <Text style={styles.smallText}>{item.content}</Text>
          </TouchableOpacity>
          <View style={{height: 70}} />
        </View>
      )}
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  imageWrapper: {
    top: TOP * 1.2,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  smallText: {
    fontSize: 15,
    color: 'black',
  },
  container: {
    flex: 1,
    // justifyContent: 'center',
  },
  titleWrite: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  titleTextName: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    // top: spacing,
    padding: spacing,
    top: 20,
  },
  backIconContainer: {
    position: 'absolute',

    left: 15,
    zIndex: 999,
    width: 35,
    height: 35,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: width * 0.7,
  },
});
export default Detail;
