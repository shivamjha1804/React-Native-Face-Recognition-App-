import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useCallback} from 'react';
import {Container, Icon} from 'react-native-basic-elements';
import NavigationService from '../../Services/Navigation';
import NavBar from '../../Components/NavBar/NavBar';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {MAIN_BASE_URL} from '../../Utils/EnvVariables';
import {setUser} from '../../Redux/reducer/User';
import AuthService from '../../Services/Auth';
import {useFocusEffect} from '@react-navigation/native';

const Home = () => {
  const {userData} = useSelector(state => state.User);
  const dispatch = useDispatch();
  const [ownData, setOwnData] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const token = userData?.data?.token;
      const fetchOwnDetail = async () => {
        try {
          axios
            .get(`${MAIN_BASE_URL}/user/userowninfo`, {
              headers: {
                Authorization: token,
                userType: 'User',
              },
            })
            .then(res => {
              dispatch(setUser(res?.data));
              console.log('Res data : ', JSON.stringify(res.data));
              setOwnData(res.data);
              AuthService.setToken(res?.data?.data?.token);
              AuthService.setAccount(res?.data);
            })
            .catch(error => {
              console.log('Error from fetchOwnDetail of user : ', error);
            });
        } catch (error) {
          console.log('Error from fetchOwnDetail : ', error);
        }
      };

      fetchOwnDetail();

      return () => {
        // Cleanup if necessary
      };
    }, [userData, dispatch]),
  );

  return (
    <Container style={styles.Screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavBar />

      <View style={styles.Body}>
        <View style={styles.Card}>
          <View style={styles.CardHeader}>
            <Text style={styles.CardTitle}>Status: </Text>
            <View style={styles.Status}>
              <Icon
                name="dot-fill"
                type="Octicons"
                color={
                  ownData?.data?.checkinStatus === 'checkedOut'
                    ? 'red'
                    : 'green'
                }
              />
              <Text
                style={{
                  ...styles.CardTitle,
                  color:
                    ownData?.data?.checkinStatus === 'checkedOut'
                      ? 'red'
                      : 'green',
                }}>
                {ownData?.data?.checkinStatus === 'checkedOut'
                  ? 'Checked Out'
                  : 'Checked In'}
              </Text>
            </View>
          </View>
          <View style={styles.CardBody}>
            <TouchableOpacity
              style={{
                ...styles.CardItem,
                backgroundColor:
                  ownData?.data?.checkinStatus === 'checkedIn'
                    ? 'silver'
                    : '#fff',
              }}
              onPress={() =>
                NavigationService.navigate('FaceRecognation', {type: 'login'})
              }
              disabled={ownData?.data?.checkinStatus === 'checkedIn'}>
              <Image
                style={styles.CardImage}
                source={require('../../Assets/Icons/enter.png')}
              />
              <Text style={styles.CardText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                NavigationService.navigate('FaceRecognation', {type: 'logout'})
              }
              style={{
                ...styles.CardItem,
                backgroundColor:
                  ownData?.data?.checkinStatus === 'checkedOut'
                    ? 'silver'
                    : '#fff',
              }}
              disabled={ownData?.data?.checkinStatus === 'checkedOut'}>
              <Image
                style={styles.CardImage}
                source={require('../../Assets/Icons/logout.png')}
              />
              <Text style={styles.CardText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default Home;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  Status: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  Body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  Card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  CardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  CardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  CardBody: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  CardItem: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  CardImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  CardText: {
    fontSize: 16,
    color: '#666',
  },
});
