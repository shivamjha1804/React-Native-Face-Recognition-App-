import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {AppButton, Container} from 'react-native-basic-elements';
import {exists} from 'react-native-fs';

const PreviewImage = ({route}) => {
  const {image} = route.params;
  console.log('Image : ', image);

  useEffect(() => {
    const fileExists = exists(`file://${image}`);
    console.log('File exists:', fileExists);
  }, []);

  return (
    <Container>
      <Container style={styles.container}>
        <ImageBackground source={{uri: image}} style={styles.imageBackground}>
          <View style={styles.overlay}>
            <Text style={styles.text}>Preview</Text>
          </View>
        </ImageBackground>
        <AppButton
          title="Go Back"
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            backgroundColor: 'blue',
          }}
          textStyle={{
            color: 'white',
            fontWeight: 'bold',
            fontSize: '15',
          }}
        />
      </Container>
    </Container>
  );
};

export default PreviewImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBackground: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  text: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});
