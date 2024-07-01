import React, {useState, useRef, useEffect} from 'react';
import {
  Image,
  StatusBar,
  TouchableOpacity,
  View,
  StyleSheet,
  Text,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Container} from 'react-native-basic-elements';
import {RNCamera} from 'react-native-camera';
import {moderateScale} from '../../Constants/PixelRatio';
import firebase from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml';
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

const FaceRecognition = () => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [startRecognition, setStartRecognition] = useState(false);
  const [face, setFace] = useState(null);
  const {hasPermission, requestPermission} = useCameraPermission();
  const [autoScale, setAutoScale] = useState(true);
  const device = useCameraDevice('front');
  // const cameraRef = useRef < Camera > null;
  const cameraRef = useRef(null);
  // const camera = useRef < VisionCamera > null;
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

  const handleRecognitionStart = async () => {
    setIsRecognizing(true);
  };

  const faceDetectionOptions =
    useRef <
    FaceDetectionOptions >
    {
      performanceMode: 'accurate',
      classificationMode: 'all',
    }.current;

  function handleFacesDetected(faces, frame) {
    console.log('faces', faces[0], 'frame', frame.toString());
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

  const captureImage = async () => {
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePhoto({
          quality: 85,
          skipMetadata: true,
        });
        console.log('Photo captured:', photo);
        // Alert.alert(
        //   'Photo captured',
        //   'Check your console log for the photo URI',
        // );
      }
    } catch (error) {
      console.error('Failed to capture photo', error);
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
                // photo={true}
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
          onPress={handleRecognitionStart}
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

  bound: ({width, height, x, y}) => {
    return {
      position: 'absolute',
      top: y,
      left: x,
      width: width,
      height: height,
      borderWidth: 5,
      borderColor: 'red',
      zIndex: 3000,
    };
  },
});

export default FaceRecognition;
