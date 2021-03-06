import React, { Component } from 'react'

class Typing extends Component {
  render() {
    if (this.props.usersTyping.length > 0) {
      return (
        <div>
          {`${this.props.usersTyping
            .slice(0, 2)
            .join(' and ')} is typing`}
        </div>
      )
    }
    return <div></div>
  }
}

export default Typing;