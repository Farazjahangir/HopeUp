import React, { Fragment } from 'react';
import {
  StyleSheet,
  View, TouchableOpacity,
  Text, ScrollView, BackHandler,CameraRoll
} from 'react-native';
import { Icon, Input, Button } from 'react-native-elements'
import { connect } from 'react-redux'
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

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

  async componentDidMount() {
    const { userObj } = this.props
    BackHandler.addEventListener('hardwareBackPress', this.savingDraft);

    const response = await firebase.getDocument('Drafts', userObj.userId)
    if (response.data()) {
      const blog = response.data().blog
      const blogTitle = response.data().blogTitle
      this.setState({ blog, blogTitle })
    }

  }
  componentWillUnmount() {
    console.log('componentWillUnmount');

    BackHandler.removeEventListener('hardwareBackPress', this.savingDraft);
  }

  async publishBlog() {
    const { blogTitle, blog } = this.state
    const { userObj } = this.props
    const blogData = {
      blogTitle,
      blog,
      userId: userObj.userId
    }
    try {
      const response = await firebase.addDocument('Blog', blogData)
      alert('Published')
      this.setState({ blog: '', blogTitle: '' })
      await firebase.deleteDoc('Drafts', userObj.userId)
      this.props.navigation.goBack()
    }
    catch (e) {
      alert(e.message)
    }
  }

  savingDraft = async () => {
    const { blogTitle, blog } = this.state
    const { userObj } = this.props
    if (!blogTitle && !blog) {
      return this.props.navigation.goBack()
    }

    const blogData = {
      blogTitle,
      blog,
      userId: userObj.userId
    }

    const response = await firebase.setDocument('Drafts', userObj.userId, blogData)
    alert('Saved To Draft')
    this.props.navigation.goBack()
  }
  back() {
    this.savingDraft()
  }
  async uploadMedia(){
    request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)
  .then(result => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        console.log(
          'The permission has not been requested / is denied but requestable',
        );
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  })
  .catch(error => {
    console.log('Error');
    
  });
    const media = await CameraRoll.getPhotos({
      first: 20,
      assetType: 'All',
    })
    console.log('Media' , media);
    
  }

  render() {
    const { navigation } = this.props
    const { blogTitle, blog } = this.state

    return (
      <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1}}>
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
          <CustomButton title={'Close'} buttonStyle={{ borderColor: '#ccc', borderWidth: 1 }} onPress={() => this.back()} />
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
          numberOfLines={13}
          onChangeText={(text) => this.setState({ blog: text })}
          placeholder={'Your Blog'}
          placeholderTextColor={'#fff'}
          inputStyle={{ color: '#fff', letterSpacing: 2 }} />
        <CustomButton 
          title={'Upload'} 
          buttonStyle={{ borderColor: '#ccc', borderWidth: 1, marginVertical: 10 }} 
          onPress={()=> this.uploadMedia()} 
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColor,
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

