//import liraries
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import React, {Component} from 'react';
import SignIn from '../Screens/Auth/SignIn';
import Register from '../Screens/Auth/Register';
import FaceRecognation from '../Screens/Auth/FaceRecognation';
import UploadImage from '../Screens/Auth/UploadImage';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onbroding"
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="FaceRecognation" component={FaceRecognation} />
      <Stack.Screen name="UploadImage" component={UploadImage} />
    </Stack.Navigator>
  );
};

export default AuthStack;
