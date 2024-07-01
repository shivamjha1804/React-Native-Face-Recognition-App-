import React, {useState} from 'react';
import {StatusBar, StyleSheet, View, Alert} from 'react-native';
import {
  AppButton,
  AppTextInput,
  Container,
  Icon,
  Text,
} from 'react-native-basic-elements';
import {moderateScale} from '../../Constants/PixelRatio';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/reducer/User';
import NavigationService from '../../Services/Navigation';

const Register = () => {
  const dispatch = useDispatch();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = password => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    return passwordRegex.test(password);
  };

  const handleRegister = () => {
    // if (!validateEmail(email)) {
    //   Alert.alert('Invalid Email', 'Please enter a valid email address.');
    //   return;
    // }

    // if (!validatePassword(password)) {
    //   Alert.alert(
    //     'Weak Password',
    //     'Password must be 8-16 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.',
    //   );
    //   return;
    // }

    // if (password !== confirmPassword) {
    //   Alert.alert('Password Mismatch', 'Passwords do not match.');
    //   return;
    // }

    // Perform registration logic here
    // dispatch(setUser({firstName, lastName, email}));
    NavigationService.navigate('FaceRecognation');
  };

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e42" />
      <View style={styles.formContainer}>
        <Text style={styles.title}>Register</Text>
        <AppTextInput.Outlined
          placeholder="Enter Your First Name"
          value={firstName}
          onChangeText={setFirstName}
          containerStyle={styles.input}
          inputStyle={styles.text}
          placeholderTextStyle={styles.placeholderText}
        />
        <AppTextInput.Outlined
          placeholder="Enter Your Last Name"
          value={lastName}
          onChangeText={setLastName}
          containerStyle={styles.input}
          inputStyle={styles.text}
          placeholderTextStyle={styles.placeholderText}
        />
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
          secureTextEntry={showPassword}
          value={password}
          onChangeText={setPassword}
          inputStyle={styles.text}
          containerStyle={styles.input}
          placeholderTextStyle={styles.placeholderText}
          rightAction={
            <Icon
              onPress={() => setShowPassword(!showPassword)}
              name={showPassword ? 'eye' : 'eye-with-line'}
              type="Entypo"
            />
          }
        />
        <AppTextInput.Outlined
          placeholder="Confirm Your Password"
          secureTextEntry={showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          inputStyle={styles.text}
          containerStyle={styles.input}
          placeholderTextStyle={styles.placeholderText}
          rightAction={
            <Icon
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              name={showConfirmPassword ? 'eye' : 'eye-with-line'}
              type="Entypo"
            />
          }
        />
        <AppButton
          title="Next Page"
          onPress={handleRegister}
          style={styles.button}
          textStyle={styles.buttonText}
        />
        <Text>
          Already have an account?{' '}
          <Text
            onPress={() => NavigationService.navigate('SignIn')}
            style={styles.linkText}>
            Sign In
          </Text>
        </Text>
      </View>
    </Container>
  );
};

export default Register;

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
  linkText: {
    color: '#1F51FF',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
