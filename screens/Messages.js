import React, { Fragment } from 'react';
import {
  StyleSheet,
  View, TouchableOpacity,
  Text, FlatList, ScrollView, TouchableWithoutFeedback,
  Image, StatusBar
} from 'react-native';
import CustomInput from '../Component/Input'
import CustomButton from '../Component/Button'
import CustomHeader from '../Component/header'
import { withNavigation, NavigationEvents } from 'react-navigation'
import { Icon, SearchBar } from 'react-native-elements';
import { themeColor, pinkColor } from '../Constant/index';
import DocumentPicker from 'react-native-document-picker';
import { connect } from 'react-redux'
import firebase from '../utils/firebase'
import FirebaseLib from 'react-native-firebase'

class Messages extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      image: '',
      otherUsersArr: []
    }
  }
  static navigationOptions = {
    header: null,
  };

  async componentDidMount() {
    const { userId } = this.props.userObj
    const otherUsersArr = []
    const db = FirebaseLib.firestore()
    const idsArray = await firebase.getDocumentByQuery('Rooms', 'userObj.' + userId, '==', true)
    // console.log(idsArray)
    for (var i = 0; i < idsArray.length; i++) {
      if (idsArray[i] !== userId) {
        const otherUsers = await firebase.getDocument('Users', idsArray[i])
        const response = await db.collection('Rooms')
          .where('userObj.' + userId, '==', true)
          .where('userObj.' + idsArray[i], '==', true)
          .get()
        response.forEach(async value => {
          console.log('value.id', value.id);

          const doc = await db.collection('Rooms').doc(value.id).collection('Messages').orderBy('createdAt').get()
          console.log('Dcouemt ======>', doc);
          const lastIndex = doc.docs.length - 1
          const message = doc.docs[lastIndex].data().message
          console.log('MEssages', message);
          otherUsers.data().lastMessage = message
          console.log('  otherUsers.data()', otherUsers.data());
          otherUsersArr.push(otherUsers.data())
        })

      }
    }
    this.setState({ otherUsersArr })
  }


  messageList = (item) => <TouchableOpacity
    onPress={() => this.props.navigation.navigate("Chat", { otherUserId: item.userId })}
    style={styles.messageContainer}>
    <View>
      {console.log('Item ==>', item)}
      <Image source={require('../assets/avatar.png')}
        style={styles.msgImage} />
      <View style={[styles.iconContainer, { backgroundColor: pinkColor }]}>
        <Text style={{ color: '#fff', fontSize: 10 }}> 1</Text>
      </View>
    </View>
    <View style={{ flex: 1 }}>
      <View style={styles.msgName}>
        <Text style={styles.name}>{item.userName}</Text>
      </View>
      <Text style={{ paddingLeft: 5, color: '#ccc' }}>{item.lastMessage}</Text>
    </View>
  </TouchableOpacity>


  render() {
    const { navigation } = this.props.navigation
    const { otherUsersArr } = this.state
    console.log('otherUsersArr', otherUsersArr);

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={themeColor} translucent />
        <View style={{
          height: 100, flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', marginHorizontal: 15,
        }}>
          <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold', marginTop: 12 }}>Messages</Text>
        </View>
        <SearchBar
          containerStyle={{
            margin: 8,
            borderRadius: 5,
            backgroundColor: themeColor,
            borderTopColor: themeColor,
            borderBottomColor: themeColor
          }}
          placeholder={'Search'}
          inputContainerStyle={{ backgroundColor: '#fff' }}
        />
        <View style={{ paddingHorizontal: 12, borderBottomColor: 'grey', borderBottomWidth: 3 }}>
          <Text style={{ color: '#ccc', fontSize: 13, fontWeight: 'bold' }}> ONLINE CONTACTS</Text>
          <View style={{ paddingVertical: 12, }}>
            <FlatList
              data={['1', '2', '3', '4', '5', '6']}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => <View >
                <View>
                  <Image source={require('../assets/avatar.png')}
                    style={styles.msgImage} />
                  <View style={[styles.iconContainer, { backgroundColor: 'green', height: 12, width: 12, marginRight: 12 }]} />
                </View>
                <Text style={{
                  color: '#ccc', fontSize: 11, fontWeight: 'bold',
                  textAlign: 'center', marginTop: 8
                }}>ABCD</Text>
              </View>}
            />
          </View>
        </View>
        {!!otherUsersArr.length
          &&
          <FlatList
            data={otherUsersArr}
            renderItem={({ item, index }) => this.messageList(item)}
          />
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColor
  },
  iconContainer: {
    height: 18,
    width: 18,
    backgroundColor: pinkColor,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: -12,
    marginRight: 8
  },
  messageContainer: {
    minHeight: 100, flexDirection: 'row', alignItems: "center",
    borderBottomWidth: 0.5, borderBottomColor: 'grey'
  },
  msgImage: { height: 55, width: 55, borderRadius: 25, marginHorizontal: 10 },
  msgName: {
    flexDirection: "row", justifyContent: 'space-between',
    marginHorizontal: 5, height: 30, alignItems: "center",
  },
  name: { fontWeight: 'bold', fontSize: 18, color: '#fff' },

})

const mapDispatchToProps = (dispatch) => {
  return {}
}
const mapStateToProps = (state) => {
  return {
    userObj: state.auth.user
  }
}

export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(Messages))

