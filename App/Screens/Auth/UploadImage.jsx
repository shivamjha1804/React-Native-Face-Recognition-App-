import {
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {AppButton, Container} from 'react-native-basic-elements';
import {moderateScale} from '../../Constants/PixelRatio';
import ImageCropPicker from 'react-native-image-crop-picker';
import NavigationService from '../../Services/Navigation';

const UploadImage = () => {
  const [response, setResponse] = useState(null);

  const pick = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    })
      .then(image => {
        console.log(image);
        setResponse(image);
      })
      .catch(e => console.log(e));
  };

  return (
    <Container style={styles.container}>
      {/* <StatusBar barStyle="light-content" backgroundColor="#3e3e42" /> */}

      {response == null ? (
        <TouchableOpacity style={styles.formContainer} onPress={pick}>
          <Image
            source={require('../../Assets/UploadIcon/upload.png')}
            style={styles.uploadIcon}
          />
          <Text style={styles.uploadIconText}>Upload Image</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.imagePreview}>
          <Image source={{uri: response.path}} style={styles.previewImage} />
          <View style={styles.buttonContainer}>
            <AppButton
              title="Cancel"
              textStyle={styles.cancelButtonText}
              onPress={() => {
                setResponse(null);
              }}
              style={styles.cancelButton}
            />
            <AppButton
              title="Register"
              textStyle={styles.uploadButtonText}
              onPress={() => {
                NavigationService.navigate('SignIn');
              }}
              style={styles.uploadButton}
            />
          </View>
        </View>
      )}
    </Container>
  );
};

export default UploadImage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e3e42',
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(15),
    backgroundColor: '#F8F9F9',
    borderRadius: moderateScale(10),
    elevation: 1,
    opacity: 0.85,
    zIndex: 2,
  },
  uploadIcon: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
    marginHorizontal: moderateScale(10),
    marginVertical: moderateScale(10),
  },
  uploadIconText: {
    color: '#1F51FF',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  imagePreview: {
    marginTop: moderateScale(20),
    alignItems: 'center',
    flex: 1,
  },
  previewImage: {
    width: moderateScale(300),
    height: '50%',
    resizeMode: 'contain',
  },
  uploadButton: {
    backgroundColor: '#1F51FF',
    // padding: moderateScale(10),
    paddingHorizontal: moderateScale(40),
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(10),
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: 'red',
    // padding: moderateScale(10),
    paddingHorizontal: moderateScale(50),
    borderRadius: moderateScale(10),
    marginVertical: moderateScale(10),
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: moderateScale(20),
    width: '100%',
    height: '50%',
    alignItems: 'flex-end',
    marginBottom: moderateScale(50),
  },
});
