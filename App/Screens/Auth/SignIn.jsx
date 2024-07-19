import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {
  AppButton,
  AppTextInput,
  Container,
  Icon,
} from 'react-native-basic-elements';
import NavigationService from '../../Services/Navigation';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/reducer/User';

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [seePassword, setSeePassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validate = () => {
    let valid = true;
    if (!email) {
      setEmailError('Email is required*');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid*');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Password is required*');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleSignIn = () => {
    if (validate()) {
      // Perform sign-in operation
      dispatch(setUser({}));
      console.log('Signing in with:', {email, password});
    }
  };

  return (
    <Container style={styles.Screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f0f0f0" />
      <View style={styles.Card}>
        <View style={styles.Header}>
          <Text style={styles.HeaderText}>Sign In</Text>
        </View>
        <View style={styles.Body}>
          <AppTextInput.Outlined
            placeholder="Email"
            style={styles.Input}
            value={email}
            onChangeText={setEmail}
          />
          {emailError && <Text style={styles.Error}>{emailError}</Text>}

          <AppTextInput.Outlined
            placeholder="Password"
            style={styles.Input}
            secureTextEntry={!seePassword}
            value={password}
            onChangeText={setPassword}
            errorMessage={passwordError}
            rightAction={
              <Icon
                onPress={() => setSeePassword(!seePassword)}
                name={seePassword ? 'eye' : 'eye-off'}
                type="Ionicon"
              />
            }
          />
          {passwordError && <Text style={styles.Error}>{passwordError}</Text>}
        </View>
        <View style={styles.Footer}>
          <Text
            onPress={() => NavigationService.navigate('ForgetPassword')}
            style={styles.ForgotText}>
            Forgot Password?
          </Text>
        </View>
        <AppButton
          style={styles.AppButton}
          title="Sign In"
          textStyle={styles.ButtonText}
          onPress={handleSignIn}
        />
      </View>
    </Container>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  Input: {
    color: '#000',
  },
  Card: {
    width: '90%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    alignItems: 'center',
  },
  Header: {
    marginBottom: 20,
  },
  HeaderText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  Body: {
    width: '100%',
    marginBottom: 20,
  },
  Footer: {
    alignSelf: 'flex-end',
  },
  ForgotText: {
    fontSize: 14,
    color: '#f95700ff',
    marginBottom: 10,
  },
  ButtonText: {
    fontSize: 20,
    color: '#fff',
  },
  AppButton: {
    backgroundColor: '#00a4ccff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '90%',

  },
  Error: {
    color: 'red',
    fontSize: 14,
  },
});
