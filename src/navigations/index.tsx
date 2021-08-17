import {NavigationContainer} from '@react-navigation/native';
import React, {FC} from 'react';
import MainNavigation from './MainNavigation';

const IndexNavigation: FC = () => {
  return (
    <NavigationContainer>
      <MainNavigation />
    </NavigationContainer>
  );
};

export default IndexNavigation;
