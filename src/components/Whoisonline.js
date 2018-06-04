import React, { Component } from 'react'

class Whoisonline extends Component {
    
  render() {
    const styles = {
        li: {
          display: 'flex',
          alignItems: 'center',
          marginTop: 5,
          marginBottom: 5,
          paddingTop: 2,
          paddingBottom: 2,
        },
        div: {
          borderRadius: '50%',
          width: 11,
          height: 11,
          marginRight: 10,
          display:"inline-block"
        },
        uName:{
            display:"inline-block"
        }
      }
      if(this.props.user){
        return (
            <ul>
             {this.props.user.map((i,index)=>{
                 console.log(i.presence.state);
                 if(i.id==this.props.currentUser.id){
                     return (
                         <li key={index}>
                             <div>
                                 <div style={{
                                ...styles.div,
                                backgroundColor:
                                i.presence.state === 'online' ? '#539eff' : '#414756',
                            }}></div>
                                 <div style={styles.uName}>{i.name}(You)</div>
                             </div>
                         </li>
                     );
                 }
                   return (<li key={index}><div style={{
                    ...styles.div,
                    backgroundColor:
                    i.presence.state === 'online' ? '#539eff' : '#414756',
                }}></div><div style={styles.uName}>{i.name}</div></li>)
             })}
            </ul>
         )
      }
    return <p>.....Loading</p>
  }
}

export default Whoisonline;