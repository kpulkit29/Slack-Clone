import React, { Component } from 'react'
import Username from "./components/Username";
import Chat from "./components/Chat";
class App extends Component {
  constructor(){
    super();
    this.state={
      curr_user:"",
      curr_screen:"basicScreen"
    }
  }
  sendName(str){
    console.log(str);
    fetch("/username",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username:str})
    }).then((res)=>{
        this.setState({
          curr_user:str,
          curr_screen:"chat"
        })
    }).catch(err=>console.log(err));
  }
  render() {
      if(this.state.curr_screen==="basicScreen"){
        return <Username onsubmit={this.sendName.bind(this)}/>
      }
      if(this.state.curr_screen==="chat"){
        return <Chat user={this.state.curr_user}/>
      }
  }
}

export default App
