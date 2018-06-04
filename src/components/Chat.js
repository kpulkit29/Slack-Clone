import React, { Component } from 'react';
import Chatkit from "@pusher/chatkit";
import Message from "./Message";
import Messageform from "./Messageform";
import Typing from "./Typing";
import Whoisonline from "./Whoisonline";
//a smart component
class Chat extends Component {
  constructor(){
      super();
      this.state={
          currentUser:{},
          currentRoom:{},
          messages:[],
          usersTyping:[]
      }
  }
  componentDidMount(){
    const chatManager = new Chatkit.ChatManager({
          instanceLocator: 'v1:us1:b096f295-74eb-457b-8e46-31303cde2e79',
          userId: this.props.user,
          tokenProvider: new Chatkit.TokenProvider({
            url: '/authenticate',
          }),
        })
    chatManager.connect().then(result=>{
        console.log("result"+result);
        this.setState({currentUser:result});
        return result.subscribeToRoom({
                      roomId:8683427,
                      messageLimit: 100,
                      hooks: {
                        onNewMessage: message => {
                          this.setState({
                            messages: [...this.state.messages, message],
                          })
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                              usersTyping: [...this.state.usersTyping, user.name],
                            })
                          },
                          onUserStoppedTyping: user => {
                            this.setState({
                              usersTyping: this.state.usersTyping.filter(
                                userResult => userResult !== user.name
                              ),
                            })
                          },
                          onUserCameOnline: () => this.forceUpdate(),
                          onUserWentOffline: () => this.forceUpdate(),
                          onUserJoined: () => this.forceUpdate(),
                      },
                    })
                  })
                  .then(currentRoom => {
                    this.setState({ currentRoom })
    }).catch(error=>console.log(error));
  }
  addMessage(text){
      console.log(text);
      if(text.length>0&&text!=undefined&&text!=null){
        this.state.currentUser.sendMessage({
            roomId:this.state.currentRoom.id,
            text
        });
      }
 
  }
  typingevent(){
    this.state.currentUser
    .isTypingIn({ roomId: this.state.currentRoom.id })
    .catch(error => console.error('error', error))
  }
  render() {
    const styles = {
        container: {
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
        },
        chatContainer: {
          display: 'flex',
          flex: 1,
        },
        whosOnlineListContainer: {
          width: '25%',
          padding: 20,
          backgroundColor: '#2c303b',
          color: 'white',
        },
        chatListContainer: {
          padding: 20,
          width: '85%',
          display: 'flex',
          flexDirection: 'column',
        },
      }
    return (
        <div style={styles.container}>
        <div style={styles.chatContainer}>
        <section style={styles.whosOnlineListContainer}><Whoisonline currentUser={this.state.currentUser} user={this.state.currentRoom.users}/></section>
         <section style={styles.chatListContainer}>
         <Message messages={this.state.messages} style={styles.chatList}/>
         <Typing usersTyping={this.state.usersTyping}/>
         <Messageform onsubmit={mesg=>this.addMessage(mesg)} onchange={this.typingevent.bind(this)}/>
         </section>
      </div>
      </div>
    );
  }
}

export default Chat;