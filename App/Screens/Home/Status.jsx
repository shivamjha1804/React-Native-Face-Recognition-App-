import {StatusBar, StyleSheet, Text, View} from 'react-native';
import Reac from 'react';
import {Container, Icon} from 'react-native-basic-elements';
import NavBar from '../../Components/NavBar/NavBar';
import {useRoute} from '@react-navigation/native';

const Status = () => {
  const route = useRoute();
  const {response} = route.params;
  const {type} = route.params;

  console.log('Response : ', response);
  console.log('type : ', type);

  function formatDateAndTime(dateString) {
    const date = new Date(dateString);

    const options = {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };

    return date.toLocaleString('en-US', options).replace(',', '');
  }

  return (
    <Container style={styles.Screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <NavBar />

      <View style={styles.Container}>
        <View style={styles.Card}>
          <View style={styles.CardHeader}>
            <Text style={styles.CardTitle}>Status:</Text>
            <View style={styles.Status}>
              <Icon
                name="dot-fill"
                type="Octicons"
                color={
                  response?.data?.checkinStatus === 'checkedOut'
                    ? 'red'
                    : 'green'
                }
                style={styles.StatusIcon}
              />
              <Text
                style={[
                  styles.CardTitle,
                  {
                    color:
                      response?.data?.checkinStatus === 'checkedOut'
                        ? 'red'
                        : 'green',
                  },
                ]}>
                {response?.data?.checkinStatus === 'checkedOut'
                  ? 'Checked Out'
                  : 'Checked In'}
              </Text>
            </View>
          </View>

          <View style={styles.CardBody}>
            <View style={styles.CardSection}>
              <Text style={styles.Title}>Name:</Text>
              <Text style={styles.Text}>
                {response?.data?.firstName} {response?.data?.lastName}
              </Text>
            </View>
            <View style={styles.CardSection}>
              <Text style={styles.Title}>Location:</Text>
              <Text style={styles.Text}>
                {type == 'login'
                  ? response?.data?.loginLocation
                  : response?.data?.logoutLocation}
              </Text>
            </View>
            <View style={styles.CardSection}>
              <Text style={styles.Title}>Date & Time:</Text>
              <Text style={styles.Text}>
                {type == 'login'
                  ? formatDateAndTime(response?.data?.loginTime)
                  : formatDateAndTime(response?.data?.logOutTime)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Container>
  );
};

export default Status;

const styles = StyleSheet.create({
  Screen: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  Container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  CardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  Status: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  StatusIcon: {
    marginRight: 5,
  },
  CardBody: {
    paddingTop: 10,
  },
  CardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  Title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  Text: {
    fontSize: 16,
    color: '#666',
  },
});
