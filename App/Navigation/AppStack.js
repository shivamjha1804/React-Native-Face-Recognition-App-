//import liraries
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {Component} from 'react';
import Home from '../Screens/Home/Home';
import Profile from '../Screens/Home/Profile';
import ChangePassword from '../Screens/Home/ChangePassword';
import FaceRecognition from '../Screens/Home/FaceRecognation';
import Status from '../Screens/Home/Status';

const Stack = createStackNavigator();

const AppStack = () => {
  // const { login_status } = useSelector(state => state.User)
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="FaceRecognation" component={FaceRecognition} />
      <Stack.Screen name="Status" component={Status} />
    </Stack.Navigator>
  );
};

export default AppStack;
