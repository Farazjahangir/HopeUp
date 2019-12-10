import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, StatusBar } from 'react-native';
import Routes from './navigation'
import { themeColor } from './Constant/index'
import { store } from './redux/store'
import { Provider } from 'react-redux'
import firebase from 'react-native-firebase'

export default class App extends Component {
  constructor(props) {
    super(props)
    console.disableYellowBox = true;
  }

  async componentDidMount() {
    const firestore = firebase.firestore()
    try {
      await firestore.collection('users').add({ name: 'Implemented Auth' })
      console.log('Success');
    }
    catch (e) {
      console.log('Error ====>', e.message);

    }
  }



  render() {
    console.log(store)
    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
