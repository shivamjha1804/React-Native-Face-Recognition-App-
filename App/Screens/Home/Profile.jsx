import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppButton, Container, Icon} from 'react-native-basic-elements';
import NavigationService from '../../Services/Navigation';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../Redux/reducer/User';
import axios from 'axios';
import {MAIN_BASE_URL} from '../../Utils/EnvVariables';

const Profile = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.User);

  const handleLogout = async () => {
    const token = userData?.data?.token;
    await axios
      .post(
        `${MAIN_BASE_URL}/user/userlogout`,
        {
          status: 'logout',
        },
        {
          headers: {
            Authorization: token,
            userType: 'User',
          },
        },
      )
      .then(res => {
        if (res.status) {
          console.log('Response : ', res);
          dispatch(logout());
        }
      })
      .catch(err => {
        console.log('Error from handleLogout : ', err);
      });
  };

  return (
    <Container style={styles.Screen}>
      <View style={styles.Header}>
        <Icon
          name="arrowleft"
          type="AntDesign"
          color={'#f95700ff'}
          size={35}
          style={styles.Back}
          onPress={() => NavigationService.back()}
        />
        <Text style={styles.Title}>Profile</Text>
      </View>

      <View style={styles.ProfileImageContainer}>
        <Image
          source={
            userData?.data?.profileimage == undefined ||
            userData?.data?.profileimage == ''
              ? require('../../Assets/User/user.png')
              : {uri: userData?.data?.profileimage}
          }
          style={styles.ProfileImage}
        />
      </View>

      <View style={styles.Card}>
        <View style={styles.DetailsContainer}>
          <Text style={styles.SectionTitle}>Details:</Text>
          <View style={styles.DetailRow}>
            <Text style={styles.NameTitle}>First Name:</Text>
            <Text style={styles.Name}>{userData?.data?.firstName}</Text>
          </View>
          <View style={styles.DetailRow}>
            <Text style={styles.NameTitle}>Last Name:</Text>
            <Text style={styles.Name}>{userData?.data?.lastName}</Text>
          </View>
          <View style={styles.DetailRow}>
            <Text style={styles.NameTitle}>Email:</Text>
            <Text style={styles.Name}>{userData?.data?.email}</Text>
          </View>
          <View style={styles.DetailRow}>
            <Text style={styles.NameTitle}>Change Password:</Text>
            <Text
              onPress={() => NavigationService.navigate('ChangePassword')}
              style={styles.ChangePassword}>
              Change
            </Text>
          </View>
        </View>
      </View>

      <AppButton
        style={styles.LogoutButton}
        textStyle={styles.ButtonText}
        title="Log Out"
        onPress={() => handleLogout()}
      />
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  Header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  Back: {
    position: 'absolute',
    left: 15,
  },
  Title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#f95700ff',
  },
  ProfileImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  ProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#f95700ff',
  },
  Card: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  DetailsContainer: {
    marginTop: 10,
  },
  SectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  DetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  NameTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  Name: {
    fontSize: 18,
    color: '#666',
  },
  ChangePassword: {
    fontSize: 18,
    color: '#f95700ff',
    textDecorationLine: 'underline',
  },
  LogoutButton: {
    marginTop: 30,
    alignSelf: 'center',
    width: '80%',
    backgroundColor: '#00a4ccff',
    borderRadius: 5,
  },
  ButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
