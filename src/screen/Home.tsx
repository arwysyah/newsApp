import React, {FC, useEffect} from 'react';
import {Text, View} from 'react-native';
import axios, {AxiosResponse} from 'axios';

const Home: FC = () => {
  useEffect(() => {
    fetchNews();
  });

  const fetchNews = async (): Promise<void> => {
    await axios
      .get(
        'https://newsapi.org/v2/top-headlines?country=us&category=technology&apiKey=dc678ecabd934e65893ec51e18f8703a',
      )
      .then(res => console.log(res))
      .catch(err => console.log(err));
  };
  return (
    <>
      <View>
        <Text>Home</Text>
      </View>
    </>
  );
};
export default Home;
