import {
  Alert,
  Image,
  PermissionsAndroid,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {
  AppButton,
  AppTextInput,
  Container,
  Icon,
} from 'react-native-basic-elements';
import {moderateScale} from '../../Constants/PixelRatio';
import ImageCropPicker, {openCamera} from 'react-native-image-crop-picker';
import {
  Camera,
  getCameraDevice,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import axios from 'axios';
import NavigationService from '../../Services/Navigation';

const NewUser = () => {
  const [name, setName] = useState('');
  const {hasPermission, requestPermission} = useCameraPermission();
  const [image, setImage] = useState(null);
  const [camera, setCamera] = useState(null);
  const frontCamera = useCameraDevice('front');
  const backCamera = useCameraDevice('back');
  const [cameraType, setCameraType] = useState(frontCamera);
  const [active, setActive] = useState(false);
  const [openCamera, setOpenCamera] = useState();
  const [uploadType, setUploadType] = useState('');
  const [profileResponse, setProfileResponse] = useState();
  const [faceResponse, setFaceResponse] = useState();

  const cameraRef = useRef();

  useEffect(() => {
    checkCameraPermission();
    requestPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message:
            'App needs access to your camera to perform face recognition.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const pickProfileImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      if (image) {
        const formData = new FormData();
        formData.append('image', {
          uri: 'file://' + image.path,
          type: 'image/jpeg', // or 'image/png'
          name: 'photo.jpg', // or another appropriate name
        });

        axios
          .post(
            'http://68.183.95.204:5690/upload-user-profile-image',
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            },
          )
          .then(res => {
            setProfileResponse(res.data.data.path);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const pickFaceImage = () => {
    ImageCropPicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      console.log(image);
      if (image) {
        const formData = new FormData();
        formData.append('image', {
          uri: 'file://' + image.path,
          type: 'image/jpeg', // or 'image/png'
          name: 'photo.jpg', // or another appropriate name
        });

        axios
          .post('http://68.183.95.204:5690/upload-face-image', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          })
          .then(res => {
            setFaceResponse(res.data.data.faceId);
          })
          .catch(err => {
            console.log(err);
          });
      }
    });
  };

  const profileTakePic = () => {
    setUploadType('profile');
    setOpenCamera(true);
  };

  const faceTakePic = () => {
    setUploadType('face');
    setOpenCamera(true);
  };

  const takePicture = () => {
    cameraRef.current
      .takePhoto({
        quality: 0.5,
        base64: true,
        skipProcessing: true,
      })
      .then(data => {
        console.log('Data :::::: ', data);
        setImage(data);
        setActive(false);
        setOpenCamera(false);
      });
  };

  const uploadProfileImage = () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: 'file://' + image.path,
        type: 'image/jpeg', // or 'image/png'
        name: 'photo.jpg', // or another appropriate name
      });

      axios
        .post('http://68.183.95.204:5690/upload-user-profile-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          console.log('The response is ', JSON.stringify(res));
          setProfileResponse(res.data.data.path);
          setImage(null);
        })
        .catch(err => {
          console.log('The error is ', err);
        });
    } else {
      console.log('No image to upload');
    }
  };

  const uploadFaceImage = () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: 'file://' + image.path,
        type: 'image/jpeg', // or 'image/png'
        name: 'photo.jpg', // or another appropriate name
      });

      axios
        .post('http://68.183.95.204:5690/upload-face-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          console.log('Response :: ', JSON.stringify(res));
          if (res?.data?.data?.faceId !== undefined) {
            setFaceResponse(res.data.data.faceId);
          } else {
            Alert.alert('Try Again!!');
          }
          setImage(null);
        })
        .catch(err => {
          console.log('The error is ', err);
        });
    } else {
      console.log('No image to upload');
    }
  };

  const submitData = () => {
    const data = {
      name: name,
      image: profileResponse,
      faceId: faceResponse,
    };
    console.log('Data : ', data);
    axios
      .post('http://68.183.95.204:5690/create-user', data)
      .then(res => {
        console.log('Response :: ', JSON.stringify(res));
        NavigationService.navigate('SignIn');
      })
      .catch(err => {
        console.log('The error is ', err);
      });
  };

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e42" />

      {hasPermission && openCamera && (
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            isActive={true}
            device={cameraType}
            photo={true}
            // photoQualityBalance="quality"
          />

          <Icon
            name="camera-reverse"
            type="Ionicons"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              color: '#000',
            }}
            onPress={() => {
              setCameraType(
                cameraType === backCamera ? frontCamera : backCamera,
              );
            }}
            size={30}
          />

          <AppButton
            title="Take Photo"
            onPress={() => takePicture()}
            style={{
              position: 'absolute',
              bottom: 20,
              //   right: 0,
              zIndex: 1,
            }}
            textStyle={{
              color: 'white',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          />
        </>
      )}

      {image && (
        <>
          <Image
            source={{uri: 'file://' + image.path}}
            style={{flex: 1, width: '100%', height: '100%'}}
          />

          <AppButton
            title="Cancel"
            onPress={() => setImage(null)}
            style={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              zIndex: 1,
            }}
            textStyle={{
              color: 'red',
              fontWeight: 'bold',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          />

          <AppButton
            title="Upload"
            onPress={() => {
              uploadType === 'profile'
                ? uploadProfileImage()
                : uploadFaceImage();
            }}
            style={{
              position: 'absolute',
              bottom: 20,
              right: 20,
              zIndex: 1,
            }}
            textStyle={{
              color: 'white',
              fontWeight: 'bold',
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          />
        </>
      )}
      {openCamera || image != null ? null : (
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: moderateScale(20),
            width: '90%',
            padding: moderateScale(10),
            backgroundColor: '#F8F9F9',
            borderRadius: moderateScale(10),
            elevation: 1,
            opacity: 0.85,
          }}>
          <AppTextInput.Outlined
            placeholder="Enter Your First Name"
            value={name}
            onChangeText={setName}
            inputStyle={{
              color: '#000',
              fontSize: 16,
              fontWeight: 'bold',
            }}
            containerStyle={{
              backgroundColor: '#F8F9F9',
              opacity: 0.85,
            }}
            placeholderTextStyle={styles.placeholderText}
          />

          <View style={{...styles.back_view}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => pickProfileImage()}
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  width: '50%',
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginVertical: 20,
                }}>
                <Icon
                  name="upload"
                  type="Entypo"
                  style={{
                    //   marginVertical: moderateScale(16),
                    padding: 0,
                    // backgroundColor: 'red',
                  }}
                  size={35}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={profileTakePic}
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  width: '50%',
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginVertical: 20,
                  marginLeft: 40,
                }}>
                <Icon
                  name="camera"
                  type="Entypo"
                  style={{
                    //   marginVertical: moderateScale(16),
                    padding: 0,
                    // backgroundColor: 'red',
                  }}
                  size={35}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#000',
                marginBottom: 20,
                //   marginHorizontal: 20,
              }}>
              Upload Profile Picture
            </Text>
          </View>

          <View style={{...styles.back_view}}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                onPress={() => pickFaceImage()}
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  width: '50%',
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginVertical: 20,
                }}>
                <Icon
                  name="upload"
                  type="Entypo"
                  style={{
                    //   marginVertical: moderateScale(16),
                    padding: 0,
                    // backgroundColor: 'red',
                  }}
                  size={35}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  faceTakePic();
                }}
                style={{
                  borderWidth: 1,
                  borderColor: '#000',
                  width: '50%',
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                  marginVertical: 20,
                  marginLeft: 40,
                }}>
                <Icon
                  name="camera"
                  type="Entypo"
                  style={{
                    //   marginVertical: moderateScale(16),
                    padding: 0,
                    // backgroundColor: 'red',
                  }}
                  size={35}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: 'bold',
                color: '#000',
                marginBottom: 20,
                //   marginHorizontal: 20,
              }}>
              Upload Face Picture
            </Text>
          </View>

          <AppButton
            title="Register"
            onPress={() => submitData()}
            textStyle={{
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
            }}
            style={{
              backgroundColor: '#1E90FF',
              // width: '100%',
              paddingHorizontal: 80,
              height: 50,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              //   marginBottom: 50,
              marginTop: 30,
              marginBottom: 20,
            }}
          />
        </View>
      )}
    </Container>
  );
};
export default NewUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e3e42',
    paddingHorizontal: 20,
    width: '100%',
  },
  back_view: {
    width: '100%',
    borderWidth: moderateScale(1),
    borderColor: '#000',
    borderRadius: moderateScale(5),
    backgroundColor: 'transparent',
    marginTop: moderateScale(24),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(50),
    // flexDirection: 'row',
  },
});
