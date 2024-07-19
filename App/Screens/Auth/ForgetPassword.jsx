import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {AppButton, AppTextInput, Container} from 'react-native-basic-elements';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

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
    return valid;
  };

  const handleResetPassword = () => {
    if (validate()) {
      // Perform reset password operation
      console.log('Resetting password for:', email);
    }
  };

  return (
    <Container style={styles.Screen}>
      <View style={styles.Card}>
        <View style={styles.Header}>
          <Text style={styles.HeaderText}>Forget Password</Text>
        </View>
        <View style={styles.Body}>
          <AppTextInput.Outlined
            placeholder="Email"
            style={styles.Input}
            value={email}
            onChangeText={setEmail}
          />
          {emailError && <Text style={styles.Error}>{emailError}</Text>}
        </View>
        <AppButton
          style={styles.AppButton}
          title="Forget Password"
          textStyle={styles.ButtonText}
          onPress={handleResetPassword}
        />
      </View>
    </Container>
  );
};

export default ForgetPassword;

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
  ButtonText: {
    fontSize: 17,
    color: '#fff',
    // paddingHorizontal: 70,
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
