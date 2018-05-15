import React, { Component } from 'react';

class Seat extends Component {

    render() {
        let color = this.props.status === 0 ? 'green' : 'gray';
        return (
            <button style={{width: 50, height: 50, backgroundColor: color, display: 'inline-block', margin: '10px'}} >
                {this.props.name}
            </button>
        );
    }
}

export default Seat;