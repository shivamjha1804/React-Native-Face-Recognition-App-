import {StyleSheet, View} from 'react-native';
import React from 'react';
import {AppButton, Container, Text} from 'react-native-basic-elements';
import {moderateScale} from '../../Constants/PixelRatio';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../Redux/reducer/User';

const Home = () => {
  const dispatch = useDispatch();
  const {userData} = useSelector(state => state.User);

  console.log('The responce of user : ', JSON.stringify(userData));
  return (
    <Container
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: moderateScale(20),
            fontWeight: 'bold',
            color: '#000',
            marginBottom: moderateScale(10),
          }}>
          Face :{' '}
        </Text>
        <Text
          style={{
            fontSize: moderateScale(20),
            fontWeight: 'bold',
            color: '#000',
            marginBottom: moderateScale(10),
          }}>
          {userData?.data?.data?.name}
        </Text>
      </View>
      <AppButton
        title="Go To Auth with Logout"
        textStyle={{
          color: '#fff',
          fontWeight: '700',
        }}
        style={{
          paddingHorizontal: moderateScale(15),
          marginTop: moderateScale(10),
        }}
        onPress={() => dispatch(logout())}
      />
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({});
