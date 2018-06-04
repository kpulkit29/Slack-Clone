import React, { Component } from 'react'
//a smart component
class Messageform extends Component {
  constructor(){
      super();
      this.state={
            typed_message:""
      }
  }
  onChangeName(e){
   this.setState({
    typed_message:e.target.value
   });
   this.props.onchange();
  }
  on_submit(e){
      e.preventDefault();
      this.props.onsubmit(this.state.typed_message);
  }
  render() {
    const styles = {
        container: {
          padding: 20,
          borderTop: '1px #4C758F solid',
          marginBottom: 20,
        },
        form: {
          display: 'flex',
        },
        input: {
          color: 'inherit',
          background: 'none',
          outline: 'none',
          border: 'none',
          flex: 1,
          fontSize: 16,
        },
        button:{
            width:60,
            height:40
        }
      }
    return (
        <div style={styles.container}>
      <form onSubmit={this.on_submit.bind(this)} style={styles.form}>
          <input type="text" placeholder="Type your message here" onChange={(e)=>this.onChangeName(e)} style={styles.input}/>
          <button type="submit" style={styles.button}>Submit</button>
      </form>
      </div>
    );
  }
}

export default Messageform;