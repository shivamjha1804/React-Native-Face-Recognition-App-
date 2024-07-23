import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import NavigationService from '../../Services/Navigation';
import {useSelector} from 'react-redux';

const NavBar = () => {
  const {userData} = useSelector(state => state.User);

  return (
    <View style={styles.NavBar}>
      <Image
        source={require('../../Assets/Logo/logo.png')}
        style={styles.Logo}
      />
      <TouchableOpacity onPress={() => NavigationService.navigate('Profile')}>
        <Image
          source={
            userData?.data?.profileimage == undefined ||
            userData?.data?.profileimage == ''
              ? require('../../Assets/User/user.png')
              : {uri: userData?.data?.profileimage}
          }
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
