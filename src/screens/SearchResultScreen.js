import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Container, Button } from 'native-base';
import { connect } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { eventTrack, fetchPerson } from '../store/actions';
// import { createEvent } from '../helpers/createEvent';
import headerConfig from '../helpers/headerConfig';
import constants from '../helpers/constants';
import PersonInfo from '../components/Person/PersonInfo';
import Loader from '../components/Loader/Loader';
import ErrorMessage from '../components/Messages/ErrorMessage';

class PeopleSearchScreen extends React.Component {
  static navigationOptions = ({ navigation }) =>
    headerConfig('People Search', navigation);

  componentDidMount() {
    const {
      accessToken,
      eventTrack,
      fetchPerson,
      idToken,
      isLoggedIn,
      person
    } = this.props;

    if (!person) {
      const { searchPointer } = this.props.navigation.state.params;
      const requestObject = {};
      requestObject['search_pointer_hash'] = searchPointer;
      if (isLoggedIn) {
        requestObject['authToken'] = accessToken;
        requestObject['idToken'] = idToken;
      }

      fetchPerson(JSON.stringify(requestObject), eventTrack, this.createEvent);
    }
  }

  createEvent = success => {
    let emailAddress = '';
    let options = {};
    if (typeof success === 'string') {
      options = {
        possibleMatches: this.props.possiblePersons.length,
        personMatch: false
      };
    } else {
      options = {
        possibleMatches: 0,
        personMatch: true
      };
    }
    if (!this.props.user) {
      emailAddress = 'anonymous@unknown.org';
    } else {
      emailAddress = this.props.user.email;
    }
    const event = {
      emailAddress,
      event:
        typeof success === 'string'
          ? `person-search-${success}`
          : `person-search-${success[0]}`,
      options
    };
    // console.log('event:', event);
    return event;
  };

  render() {
    const { isLoggedIn, person } = this.props;
    console.log(person);
    return (
      <Container style={styles.container}>
        <SafeAreaView>
          <ScrollView>
            <View>
              {/* <Text style={styles.intro}>Search By:</Text> */}
              <Button
                style={styles.button}
                onPress={() => this.props.navigation.goBack()}
              >
                <Text style={styles.buttonText}>Back</Text>
              </Button>
            </View>
            {/* <SearchForm /> */}
            <View>
              {!isLoggedIn && (
                <Text style={styles.link}>
                  This is a preview. Social workers can have completely free
                  access. Click here to find out more.
                </Text>
              )}
              {this.props.error && <ErrorMessage />}
              {!person ? <Loader /> : <PersonInfo item={person} />}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 5
  },

  header: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'space-between',
    marginBottom: 25
  },

  intro: {
    padding: 10,

    fontFamily: constants.fontFamily,
    fontSize: 18
  },

  textInput: {
    borderColor: '#64aab8',
    borderWidth: 1,
    borderStyle: 'solid',
    flex: 2
  },

  textInputSmall: {
    flex: 1
  },
  nameInput: {
    flexDirection: 'row'
  },

  button: {
    margin: 10,
    padding: 10,
    backgroundColor: '#508DB3'
  },

  tab: {
    backgroundColor: 'white'
  },

  buttonText: {
    color: 'white'
  },

  link: {
    color: '#64aab8',
    lineHeight: 17,
    padding: 15,
    backgroundColor: 'rgb(216,236,240)',
    borderRadius: 10,
    marginBottom: 20
  },
  matchesText: {
    fontSize: 20,
    color: '#508DB3',
    marginBottom: 20
  }
});

const mapStateToProps = state => {
  const { error, isFetching, person, possiblePersons } = state.people;
  const { accessToken, idToken, isLoggedIn, user } = state.auth;
  return {
    accessToken,
    error,
    idToken,
    isFetching,
    isLoggedIn,
    person,
    possiblePersons,
    user
  };
};

export default connect(
  mapStateToProps,
  { eventTrack, fetchPerson }
)(PeopleSearchScreen);
