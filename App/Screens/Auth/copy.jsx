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
import {Container} from 'react-native-basic-elements';
import {RNCamera} from 'react-native-camera';
import {moderateScale} from '../../Constants/PixelRatio';
import firebase from '@react-native-firebase/app';
import ml from '@react-native-firebase/ml';

const FaceRecognition = () => {
  const [isRecognizing, setIsRecognizing] = useState(false);
  const cameraRef = useRef(null);
  const [startRecognition, setStartRecognition] = useState(false);
  const [box, setBox] = useState(null);

  useEffect(() => {
    checkCameraPermission();
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

  const handlerFace = ({faces}) => {
    try {
      if (faces && faces.length > 0) {
        const face = faces[0];
        setBox({
          boxs: {
            width: face.bounds.size.width,
            height: face.bounds.size.height,
            x: face.bounds.origin.x,
            y: face.bounds.origin.y,
            yawAngle: face.yawAngle,
            rollAngle: face.rollAngle,
          },
          rightEyePosition: face.rightEyePosition,
          leftEyePosition: face.leftEyePosition,
          bottomMouthPosition: face.bottomMouthPosition,
        });
      } else {
        setBox(null);
      }
    } catch (error) {
      console.error('Error in handlerFace:', error);
      setBox(null); // Reset state or handle error gracefully
    }
  };

  return (
    <Container style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3e3e42" />

      {startRecognition ? (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.cameraPreview}
            type={RNCamera.Constants.Type.front}
            captureAudio={false}
            onFacesDetected={handlerFace}
            faceDetectionClassifications={'all'}
            faceDetectionMode={'fast'}
            faceDetectionLandmarks={'all'}
          />
          {box && (
            <>
              <View
                style={styles.bound({
                  width: box.boxs.width,
                  height: box.boxs.height,
                  x: box.boxs.x,
                  y: box.boxs.y,
                })}
              />
            </>
          )}
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
