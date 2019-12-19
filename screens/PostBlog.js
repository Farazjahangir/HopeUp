import React, { Fragment } from 'react';
import {
  StyleSheet,
  View, TouchableOpacity,
  Text, ScrollView
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements'
import { connect } from 'react-redux'

import { themeColor, pinkColor } from '../Constant';
import CustomButton from '../Component/Button'
import firebase from '../utils/firebase'

class PostBlog extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      blogTitle: '',
      blog: ''
    }
  }
  static navigationOptions = {
    header: null,
  };

  async publishBlog() {
    const { blogTitle, blog } = this.state
    const { userObj } = this.props
    const blogData = {
      blogTitle,
      blog,
      userId : userObj.userId
    }
    try{
      const response = await firebase.addDocument('Blog' , blogData)
    }
    catch(e){
      alert(e.message)
    }
  }
  render() {
    const { navigation } = this.props
    const { blogTitle, blog } = this.state
    return (
      <ScrollView style={styles.container}>
        <View style={{
          height: 100, flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginHorizontal: 15,
        }}>
          <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold', marginTop: 12 }}>Blog</Text>
          <Icon type={'font-awesome'} name={'angle-left'} color={'#fff'} containerStyle={{ marginTop: 8 }}
            size={25} />

        </View>
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          marginHorizontal: 12, marginVertical: 12
        }}>
          <CustomButton title={'Close'} buttonStyle={{ borderColor: '#ccc', borderWidth: 1 }} />
          <CustomButton title={'Publish'} backgroundColor={pinkColor} onPress={() => this.publishBlog()} />
        </View>

        <Input
          placeholder={'Title'}
          value={blogTitle}
          placeholderTextColor={'#fff'}
          inputContainerStyle={{ height: 80 }}
          inputStyle={{
            textAlign: 'center', color: '#fff',
            fontWeight: 'bold', letterSpacing: 2, fontSize: 20
          }}
          onChangeText={(text) => this.setState({ blogTitle: text })}
          />
        <Input
          value={blog}
          multiline={true}
          numberOfLines={16}
          onChangeText={(text) => this.setState({ blog: text })}
          placeholder={'Your Blog'}
          placeholderTextColor={'#fff'}
          inputContainerStyle={{ height: '75%' }}
          inputStyle={{ color: '#fff', letterSpacing: 2 }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColor
  },
})

const mapDispatchToProps = (dispatch) => {
  return {}
}
const mapStateToProps = (state) => {
  return {
    userObj: state.auth.user
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(PostBlog)

