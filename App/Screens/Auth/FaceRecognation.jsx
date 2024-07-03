import React, {useState, useRef, useEffect} from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Text,
  PermissionsAndroid,
} from 'react-native';
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

import {
  Face,
  Camera,
  FaceDetectionOptions,
  minFaceSize,
} from 'react-native-vision-camera-face-detector';
import axios from 'axios';
import NavigationService from '../../Services/Navigation';
import {useDispatch} from 'react-redux';
import {setUser} from '../../Redux/reducer/User';

const FaceRecognition = () => {
  const dispatch = useDispatch();
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [startRecognition, setStartRecognition] = useState(false);
  const [face, setFace] = useState(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const [autoScale, setAutoScale] = useState(true);
  const [image, setImage] = useState(null);
  const device = useCameraDevice('front');
  // const cameraRef = useRef < Camera > null;
  const cameraRef = useRef(null);
  // const camera = useRef < VisionCamera > null;
  useEffect(() => {
    checkCameraPermission();
    requestPermission();
    readFilePermission();
    writeFilePermission();
    writePicturePermission();
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

  const handleRecognitionStart = async () => {
    if (!image) {
      console.log('No image to upload');
      return;
    }

    setIsRecognizing(true);

    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: 'file://' + image.path,
        type: 'image/jpeg', // or 'image/png'
        name: 'photo.jpg', // or another appropriate name
      });

      axios
        .post('http://68.183.95.204:5690/match-face', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(res => {
          console.log('The response is ', JSON.stringify(res));
          dispatch({});
          NavigationService.navigate('Home');
        })
        .catch(err => {
          console.log('The error is ', err);
        })
        .finally(() => {
          setImage(null);
        });
    } else {
      console.log('No image to upload');
      setImage(null);
    }
  };

  const faceDetectionOptions =
    useRef <
    FaceDetectionOptions >
    {
      performanceMode: 'accurate',
      classificationMode: 'all',
    }.current;

  function handleFacesDetected(faces, frame) {
    // console.log('faces', faces[0], 'frame', frame.toString());
    if (Object.keys(faces).length <= 0) {
      setFace(false);
      return;
    }

    setFace(true);

    const {bounds} = faces[0];
    const {width, height, x, y, pitchAngle, rollAngle, yawAngle} = bounds;
    aFaceW.value = width;
    aFaceH.value = height;
    aFaceX.value = x;
    aFaceY.value = y;
    aFaceRotation.value = rollAngle;

    // console.log('Camera ---> current ---> ', JSON.stringify(cameraRef.current));

    if (cameraRef.current && faces.length > 0) {
      // take photo, capture video, etc...
      // console.log('Camera ---> current ---> ', cameraRef.current);
      captureImage();
    }
  }

  console.log('Image :::: ', image);

  const captureImage = async () => {
    {
      image === null
        ? cameraRef.current
            .takePhoto({
              quality: 0.5,
              base64: true,
              skipProcessing: true,
            })
            .then(data => {
              console.log('Data : ', data);
              setImage(data.path);
            })
            .catch(error => {
              console.log('Error : ', error);
            })
        : null;
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
