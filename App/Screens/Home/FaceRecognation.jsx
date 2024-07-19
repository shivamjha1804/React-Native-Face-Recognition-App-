import {
  Face,
  Camera,
  FaceDetectionOptions,
  minFaceSize,
} from 'react-native-vision-camera-face-detector';
import React, {useState, useRef, useEffect} from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  PermissionsAndroid,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Container} from 'react-native-basic-elements';
import {moderateScale} from '../../Constants/PixelRatio';
import {
  Camera as VisionCamera,
  Frame,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import {request, PERMISSIONS} from 'react-native-permissions';
import RNFS from 'react-native-fs';
import axios from 'axios';
import NavigationService from '../../Services/Navigation';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/reducer/User';
import {useRoute} from '@react-navigation/native';

const FaceRecognition = () => {
  const route = useRoute(); // Use the hook to get route information
  const {type} = route.params;
  const dispatch = useDispatch();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [startRecognition, setStartRecognition] = useState(false);
  const [face, setFace] = useState(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const [autoScale, setAutoScale] = useState(true);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null); // State for storing location
  const device = useCameraDevice('front');
  const cameraRef = useRef(null);
  const [isFaceCaptured, setIsFaceCaptured] = useState(false);

  useEffect(() => {
    checkCameraPermission();
    requestPermission();
    readFilePermission();
    writeFilePermission();
    writePicturePermission();
    checkLocationPermission();

    return () => {
      // Cleanup function to shut down the camera when the component unmounts
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);
  const checkLocationPermission = async () => {
    console.log('Asking Permission');
    try {
      if (Platform.OS === 'ios') {
        const auth = await Geolocation.requestAuthorization('whenInUse'); // request permission for ios
        if (auth === 'granted') {
          console.log('Location permission granted for iOS');
          // Proceed with location access
        }
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'App Needs Location Permission',
            message:
              'This app needs access to your location for face recognition.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Location permission granted for Android');
          // Proceed with location access
        } else {
          console.log('Location permission denied');
          // Handle permission denial (e.g., show a message to the user)
        }
      }
    } catch (err) {
      console.log('Location error : ', err);
    }
  };

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

  const readFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'File Permission',
          message: 'App needs access to store face ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('File Read permission granted');
      } else {
        console.log('File Read permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const writeFilePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'File Permission',
          message: 'App needs access to store face ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('File Write permission granted');
      } else {
        console.log('File Write permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const writePicturePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        {
          title: 'Picture Permission',
          message: 'App needs access to store face ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Picture Read permission granted');
      } else {
        console.log('Picture Read permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const getLocation = () => {
    Geolocation.requestAuthorization();
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          resolve({latitude, longitude});
        },
        error => {
          console.error('Geolocation error:', error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    });
  };

  

  const getGeoLocationName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching location name: ', error);
      return null;
    }
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toISOString();
  };

  const handleRecognitionStart = async () => {
    if (!image) {
      console.log('No image to upload');
      return;
    }

    const filePath = image.startsWith('file://') ? image : 'file://' + image;

    try {
      const fileExists = await RNFS.exists(filePath);

      if (!fileExists) {
        console.log('File does not exist at path: ', filePath);
        return;
      }

      setIsRecognizing(true);

      const formData = new FormData();
      formData.append('image', {
        uri: filePath,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });

      try {
        const location = await getLocation();
        console.log('Location : ', location);
        formData.append('latitude', location.latitude);
        formData.append('longitude', location.longitude);

        const locationName = await getGeoLocationName(
          location.latitude,
          location.longitude,
        );
        formData.append('locationName', locationName);

        const currentTime = getCurrentTime();
        formData.append('time', currentTime);
        formData.append('type', type);

        console.log('FormData : ', formData);

        const res = await axios.post(
          'http://68.183.95.204:5690/match-face',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        ).then((res) => {
          
                  console.log('The response is ', JSON.stringify(res));
                  dispatch(setUser(res));

        })

        if (cameraRef.current) {
          cameraRef.current.stop();
        }
        NavigationService.navigate('Status');
      } catch (error) {
        console.error('Location error:', error);
        // Handle location error (e.g., show a message to the user)
      }
    } catch (err) {
      console.log('The error is ', err);
    }
  };

  const faceDetectionOptions = useRef({
    performanceMode: 'accurate',
    classificationMode: 'all',
  }).current;

  function handleFacesDetected(faces, frame) {
    if (Object.keys(faces).length <= 0) {
      setFace(false);
      return;
    }

    setFace(true);

    const {bounds, isLive} = faces[0];
    // console.log('Islive', isLive);
    // console.log('Bound  : ', faces[0]);

    const {width, height, x, y, rollAngle} = bounds;
    aFaceW.value = width;
    aFaceH.value = height;
    aFaceX.value = x;
    aFaceY.value = y;
    aFaceRotation.value = rollAngle;

    if (cameraRef.current && faces.length > 0 && !isFaceCaptured) {
      captureImage();
    }
  }

  const captureImage = async () => {
    if (isFaceCaptured) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        quality: 0.5,
        base64: true,
        skipProcessing: true,
      });
      setImage(photo.path);
      setIsFaceCaptured(true);
    } catch (error) {
      console.log('Error : ', error);
    }
  };

  function handleCameraMountError(error) {
    console.error('camera mount error', error);
  }

  const aFaceRotation = useSharedValue(0);
  const aFaceW = useSharedValue(0);
  const aFaceH = useSharedValue(0);
  const aFaceX = useSharedValue(0);
  const aFaceY = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    borderWidth: 4,
    borderLeftColor: 'rgb(0,255,0)',
    borderRightColor: 'rgb(0,255,0)',
    borderBottomColor: 'rgb(0,255,0)',
    borderTopColor: 'rgb(255,0,0)',
    width: withTiming(aFaceW.value, {
      duration: 100,
    }),
    height: withTiming(aFaceH.value, {
      duration: 100,
    }),
    left: withTiming(aFaceX.value, {
      duration: 100,
    }),
    top: withTiming(aFaceY.value, {
      duration: 100,
    }),
    // transform: [{rotate: `${aFaceRotation.value}deg`}], // Apply rotation
  }));

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e42" />

      {startRecognition ? (
        <>
          {hasPermission ? (
            <>
              <Camera
                ref={cameraRef}
                style={StyleSheet.absoluteFill}
                isActive={true}
                device={device}
                onError={handleCameraMountError}
                faceDetectionCallback={handleFacesDetected}
                faceDetectionOptions={{
                  ...faceDetectionOptions,
                  autoScale: true,
                  // minFaceSize: 0.1,
                  // trackingEnabled: true,
                }}
                // fps={1}
                photo={true}
              />

              {face ? <Animated.View style={animatedStyle} /> : null}
            </>
          ) : null}
        </>
      ) : (
        <TouchableOpacity
          style={styles.formContainer}
          onPress={() => setStartRecognition(true)}>
          <Image
            source={require('../../Assets/FaceIcon/smiley.png')}
            style={styles.faceIcon}
          />
          <Text style={styles.faceIconText}>Face Recognition</Text>
        </TouchableOpacity>
      )}

      {startRecognition && (
        <TouchableOpacity
          style={styles.recognizeButton}
          onPress={() => handleRecognitionStart()}
          disabled={isRecognizing}>
          <Text style={styles.buttonText}>
            {isRecognizing ? 'Recognizing...' : 'Start Recognition'}
          </Text>
        </TouchableOpacity>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3e3e42',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  formContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: moderateScale(20),
    backgroundColor: '#F8F9F9',
    borderRadius: moderateScale(10),
    elevation: 1,
    opacity: 0.85,
    zIndex: 2,
  },
  faceIcon: {
    height: moderateScale(60),
    width: moderateScale(60),
    resizeMode: 'contain',
    marginHorizontal: moderateScale(10),
    marginVertical: moderateScale(10),
  },
  faceIconText: {
    color: '#1F51FF',
    fontSize: moderateScale(12),
    fontWeight: 'bold',
  },
  recognizeButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#1F51FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    zIndex: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FaceRecognition;
