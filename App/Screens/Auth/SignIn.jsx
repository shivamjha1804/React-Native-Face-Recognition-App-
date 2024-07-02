import React, {useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import {
  AppButton,
  AppTextInput,
  Container,
  Text,
} from 'react-native-basic-elements';
import {moderateScale} from '../../Constants/PixelRatio';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/reducer/User';
import NavigationService from '../../Services/Navigation';

const SignIn = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // You can perform your login logic here
    // dispatch(setUser({email}));
    NavigationService.navigate('FaceRecognation');
  };

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e42" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login In</Text>
        <AppTextInput.Outlined
          placeholder="Enter Your Email"
          value={email}
          onChangeText={setEmail}
          containerStyle={styles.input}
          inputStyle={styles.text}
          placeholderTextStyle={styles.placeholderText}
        />
        <AppTextInput.Outlined
          placeholder="Enter Your Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          inputStyle={styles.text}
          containerStyle={styles.input}
          placeholderTextStyle={styles.placeholderText}
        />

        <Text>
          Have you{' '}
          <Text
            onPress={() => console.log('Forgot password')}
            style={{
              color: '#1F51FF',
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            Forgot Password?
          </Text>
        </Text>

        <AppButton
          title="Login"
          onPress={handleLogin}
          style={styles.button}
          textStyle={styles.buttonText}
        />

        <Text>
          Don't have an account?{' '}
          <Text
            onPress={() => NavigationService.navigate('Register')}
            style={{
              color: '#1F51FF',
              fontWeight: 'bold',
              textDecorationLine: 'underline',
            }}>
            Register
          </Text>
        </Text>
      </View>
    </Container>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e3e42',
  },
  formContainer: {
    width: '90%',
    padding: moderateScale(20),
    backgroundColor: '#F8F9F9',
    borderRadius: moderateScale(10),
    elevation: 1,
    opacity: 0.85,
  },
  title: {
    fontSize: moderateScale(24),
    fontWeight: 'bold',
    marginBottom: moderateScale(20),
    textAlign: 'center',
  },
  input: {
    marginVertical: moderateScale(10),
  },
  button: {
    marginTop: moderateScale(20),
    marginBottom: moderateScale(10),
    backgroundColor: '#1F51FF',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  text: {
    color: '#000',
  },
  placeholderText: {
    color: '#000',
    backgroundColor: 'transparent',
    opacity: 0.8,
  },
});
