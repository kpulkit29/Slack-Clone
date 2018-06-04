import React, { Component } from 'react';
import "./main.css";
//a smart component
class Username extends Component {
  constructor(){
      super();
      this.state={
            username:""
      }
  }
  onChangeName(e){
   this.setState({
    username:e.target.value
   });
  }
  on_submit(e){
      e.preventDefault()
      this.props.onsubmit(this.state.username);
  }
  render() {
    return (
        <div className="container">
      <form onSubmit={this.on_submit.bind(this)}>
          <input type="text" onChange={(e)=>this.onChangeName(e)} placeholder="Enter name" className="Thisinput"/>
          <button type="submit" className="Thisbutton">Submit</button>
      </form>
      </div>
    );
  }
}

export default Username