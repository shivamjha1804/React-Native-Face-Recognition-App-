import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import NavigationService from '../../Services/Navigation';

const NavBar = () => {
  return (
    <View style={styles.NavBar}>
      <TouchableOpacity onPress={() => NavigationService.navigate('Home')}>
        <Image
          source={require('../../Assets/Logo/logo.png')}
          style={styles.Logo}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => NavigationService.navigate('Profile')}>
        <Image
          source={require('../../Assets/User/user.png')}
          style={styles.ProfileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default NavBar;

const styles = StyleSheet.create({
  NavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingHorizontal: 20,
  },
  Logo: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  ProfileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    borderColor: '#f95700ff',
  },
});
