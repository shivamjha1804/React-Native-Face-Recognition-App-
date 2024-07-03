import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {scanFaces} from 'vision-camera-trustee-face-detector-v3';
import {Worklets} from 'react-native-worklets-core';

export default function App() {
  const device = useCameraDevice('front');
  // const device = useCameraDevice('back');

  React.useEffect(() => {
    (async () => {
      const status = await Camera.requestCameraPermission();
      console.log({status});
    })();
  }, [device]);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';

    try {
      const scannedFaces = scanFaces(frame, {});
      console.log(scannedFaces);
    } catch (error) {
      console.error({error});
    }
  }, []);

  if (device == null) return <Text>No Device</Text>;
  if (device) {
    return (
      <View style={{position: 'relative', flex: 1}}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={!!device}
          frameProcessor={frameProcessor}
          //pixel format should be either yuv or rgb
          pixelFormat="yuv"
        />
      </View>
    );
  }
}
