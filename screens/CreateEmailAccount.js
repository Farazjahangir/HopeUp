import React, { Fragment } from 'react';
import {
  StyleSheet,
  View, TouchableOpacity,
  Text, ScrollView
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements'
import CustomHeader from '../Component/header'
import CustomButton from '../Component/Button'
// import firebase from 'react-native-firebase'
import firebase from '../utils/firebase'

class EmailAccount extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      email: null,
      password: null,
      confirmPassword: null
    }
  }
  static navigationOptions = {
    header: null,
  };

  sText(key, value) {
    this.setState({ [key]: value })
  }

  checkValidation = () => {
    const { email, password, confirmPassword } = this.state
    if (!email || !password || !confirmPassword) {
      this.setState({ email: null, password: null, confirmPassword: null })
      alert('All Fields Are Required')
      return false
    }
    if (password !== confirmPassword) {
      this.setState({ password: null, confirmPassword: null })
      alert('passwords Should Match')
      return false
    }
    return true
  }

  async signIn() {
    const { email, password } = this.state
    // console.log('State ======>', this.state);

    const isValidate = this.checkValidation()
    if (!isValidate) return

    try{
      const response = await firebase.signUpWithEmail(email , password)
      console.log('Response' , response);
      
      alert('Success')
    }
    catch(e){
      alert('Message')
    }
    
  }
  render() {
    const { navigation } = this.props
    const { email, password, confirmPassword } = this.state
    return (
      <View style={{ backgroundColor: '#323643', flex: 1 }}>
        <CustomHeader navigation={navigation} title={'Sign Up'} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: "flex-end" }}>
          <Input placeholder={'Email'} placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer} inputStyle={{ fontWeight: 'bold' }} onChangeText={(email) => this.sText('email', email)} value={email} />
          <Input placeholder={'Password'} secureTextEntry={true} placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer} inputStyle={{ fontWeight: 'bold' }} onChangeText={(password) => this.sText('password', password)} value={password} />
          <Input placeholder={'Confirm Password'} secureTextEntry={true} placeholderTextColor={'#fff'}
            inputContainerStyle={styles.inputContainer} inputStyle={{ fontWeight: 'bold' }} onChangeText={(confirmPassword) => this.sText('confirmPassword', confirmPassword)} value={confirmPassword} />
          <View style={{ marginVertical: 12, width: "100%" }}>
            <CustomButton title={'Sign Up'} containerStyle={{ width: "90%" }} buttonStyle={{ borderColor: '#ccc', borderWidth: 1, }} onPress={() => this.signIn()} />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    borderColor: '#323643', backgroundColor: '#454B61', borderRadius: 7,
    paddingLeft: 12, marginVertical: 6
  },
  buttonStyle: {
    width: 140, height: 45, borderRadius: 25,
    backgroundColor: '#323643', borderColor: "#fff", borderWidth: 0.5, marginHorizontal: 6
  },
  bottomLink: { fontSize: 14, fontWeight: "bold", color: "#ccc" },
  line: { flex: 1, height: 0.5, borderWidth: 0.3, borderColor: "#ccc" }
})
export default EmailAccount
