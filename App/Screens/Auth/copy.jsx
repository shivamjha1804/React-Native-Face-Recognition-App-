import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

const FaceRecognition = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front); // Set initial camera type to front
  const [isLiveFace, setIsLiveFace] = useState(false); // Flag to track live face detection
  const cameraRef = useRef(null);
  const lastFace = useRef(null);
  const lastDetectionTime = useRef(0);

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
        setHasPermission(true);
      } else {
        console.log('Camera permission denied');
        setHasPermission(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleFacesDetected = ({faces}) => {
    if (faces.length > 0 && faces[0].faceID) {
      const face = faces[0];

      // Detect blinking
      const isBlinking =
        face.leftEyeOpenProbability < 0.5 || face.rightEyeOpenProbability < 0.5;

      // Detect head movement
      const isMoving = detectHeadMovement(face);

      // Compare face characteristics to determine if it resembles an image
      const isImageLike = face.smilingProbability < 0.1 && face.rollAngle < -20; // Adjust thresholds as needed

      if (isBlinking || isMoving || isImageLike) {
        setFaceDetected(true);
        setIsLiveFace(true); // Set live face flag
        console.log('Faces detected:', faces);
      } else {
        setFaceDetected(false);
        setIsLiveFace(false); // Reset live face flag
      }

      lastFace.current = face;
      lastDetectionTime.current = Date.now();
    } else {
      setFaceDetected(false);
      setIsLiveFace(false); // Reset live face flag
    }
  };

  const detectHeadMovement = face => {
    // Example: Compare current face position with previous position
    if (
      lastFace.current &&
      Math.abs(face.bounds.origin.x - lastFace.current.bounds.origin.x) > 20 &&
      Date.now() - lastDetectionTime.current < 1000
    ) {
      return true;
    }
    return false;
  };

  const switchCameraType = () => {
    setCameraType(
      cameraType === RNCamera.Constants.Type.front
        ? RNCamera.Constants.Type.back
        : RNCamera.Constants.Type.front,
    );
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>Camera permission denied</Text>
      ) : (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.camera}
            type={cameraType}
            onFacesDetected={handleFacesDetected}
            faceDetectionClassifications={
              RNCamera.Constants.FaceDetection.Classifications.all
            }
            faceDetectionLandmarks={
              RNCamera.Constants.FaceDetection.Landmarks.all
            }
            faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
            captureAudio={false} // Ensure audio capture is disabled to avoid background noise interference
          />

          <View style={styles.faceDetectionIndicator}>
            {faceDetected && isLiveFace ? (
              <Text style={styles.faceDetectionText}>Live Face Detected</Text>
            ) : (
              <Text style={styles.faceDetectionText}>
                No Live Face Detected
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.switchCameraButton}
            onPress={switchCameraType}>
            <Text style={styles.buttonText}>Switch Camera</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  faceDetectionIndicator: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  faceDetectionText: {
    color: 'white',
    fontSize: 18,
  },
  switchCameraButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 12,
    backgroundColor: '#007bff',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FaceRecognition;
