import {createStackNavigator} from '@react-navigation/stack';
import React, {FC} from 'react';
import Detail from '../screen/Detail';
import Home from '../screen/Home';

const Stack = createStackNavigator();

const MainNav: FC = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name={'Home'}
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name={'Details'}
        component={Detail}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default MainNav;
