import * as React from 'react';
import {runOnJS} from 'react-native-reanimated';
import {PermissionsAndroid, StyleSheet} from 'react-native';
import {useCameraDevice, useFrameProcessor} from 'react-native-vision-camera';
import {scanFaces} from 'vision-camera-face-detector'; // Assuming 'vision-camera-face-detector' is correctly imported

export default function App() {
  const [hasPermission, setHasPermission] = React.useState(false);
  const [faces, setFaces] = React.useState([]);

  const device = useCameraDevice('front');

  React.useEffect(() => {
    console.log('Faces detected:', faces);
  }, [faces]);

  React.useEffect(() => {
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

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const scannedFaces = scanFaces(frame); // Ensure scanFaces is correctly imported and used
    if (scannedFaces && scannedFaces.length > 0) {
      runOnJS(setFaces)(scannedFaces);
    }
  }, []);

  return hasPermission ? (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
      frameProcessorFps={5} // Adjust FPS as needed
    />
  ) : null;
}
