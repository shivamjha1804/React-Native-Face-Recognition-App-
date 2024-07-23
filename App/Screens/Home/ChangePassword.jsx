import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppTextInput,
  Container,
  Icon,
} from 'react-native-basic-elements';
import NavigationService from '../../Services/Navigation';
import axios from 'axios';
import {MAIN_BASE_URL} from '../../Utils/EnvVariables';
import {useSelector} from 'react-redux';
import AuthService from '../../Services/Auth';

const ChangePassword = () => {
  const {userData} = useSelector(state => state.User);
  const [showOldPassword, setShowOldPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const validate = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return false;
    }
    setError('');
    return true;
  };

  const handleChangePassword = async () => {
    if (validate()) {
      const token = userData?.data.token;

      await axios
        .post(
          `${MAIN_BASE_URL}/user/userchangepassword`,
          {
            email: userData.data.email,
            password: oldPassword,
            newPassword: newPassword,
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
            AuthService.setAccount(res?.data);
            AuthService.setToken(res?.data?.data?.token);
            NavigationService.navigate('Profile');
          }
        })
        .catch(err => {
          setError(err.response?.data?.message || 'An error occurred');
        });
    }
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
        <Text style={styles.Title}>Change Password</Text>
      </View>

      <View style={styles.Container}>
        <View style={styles.Card}>
          {error ? <Text style={styles.Error}>{error}</Text> : null}

          <AppTextInput.Outlined
            placeholder="Old Password"
            style={styles.Input}
            secureTextEntry={showOldPassword}
            value={oldPassword}
            onChangeText={setOldPassword}
            rightAction={
              <Icon
                onPress={() => setShowOldPassword(!showOldPassword)}
                name={showOldPassword ? 'eye' : 'eye-off'}
                type="Ionicon"
              />
            }
          />

          <AppTextInput.Outlined
            placeholder="New Password"
            style={styles.Input}
            secureTextEntry={showNewPassword}
            value={newPassword}
            onChangeText={setNewPassword}
            rightAction={
              <Icon
                onPress={() => setShowNewPassword(!showNewPassword)}
                name={showNewPassword ? 'eye' : 'eye-off'}
                type="Ionicon"
              />
            }
          />

          <AppTextInput.Outlined
            placeholder="Confirm Password"
            style={styles.Input}
            secureTextEntry={showConfirmPassword}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            rightAction={
              <Icon
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                type="Ionicon"
              />
            }
          />

          <AppButton
            title="Change"
            style={styles.ChangeButton}
            textStyle={styles.ButtonText}
            onPress={handleChangePassword}
          />
        </View>
      </View>
    </Container>
  );
};

export default ChangePassword;

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
  Container: {
    flex: 1,
    justifyContent: 'center',
  },
  Card: {
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
  Input: {
    color: '#000',
  },
  ChangeButton: {
    marginTop: 20,
    backgroundColor: '#00a4ccff',
    borderRadius: 5,
  },
  ButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  Error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
