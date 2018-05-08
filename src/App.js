import React, {Component} from 'react';
import axios from 'axios';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import SeatForm from './component/seat/SeatForm';
import Seat from './component/seat/Seat';
// import {BrowserRouter as Router, Route} from 'react-router-dom'

const api = 'http://localhost:3002/api/v1';
const vbaRailsEndpoint = 'http://d02994df.ngrok.io';

class App extends Component {
  constructor() {
    super();
    this.verifyToken(this.getParams('access_token'));
    this.state = {
      seats: [],
      matchID: 0,
      matchIDGet: 0,
      matchData: {},
      isEdit: false,
      enableSeatCount: 0,
      disableSeatCount: 0,
      enableSeats: [],
      disableSeats: [],
      seatTypes: [],
      seatForm: [{}]
    };
    this.state.matchID = parseInt(this.getParams('id'), 10);
    if (this.getParams('seat_types')) {
      this.state.seatTypes = this.getParams('seat_types').split(',')
    }
  }

  verifyToken = (token) => {
    var bodyFormData = new FormData();
    bodyFormData.set('access_token', token);
    axios.post(vbaRailsEndpoint + '/api/admin/check_access_token', bodyFormData)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        alert('Bạn không có quyền truy cập');
        window.location.href = vbaRailsEndpoint + '/matches'
      });
  };

  getParams = (name) => {
    let url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  };

  addSeatForm = () => {
    this.state.seatForm.push({});
    this.setState({seatForm: this.state.seatForm})
  };

  onSave = () => {
    let seats = this.state.seats;
    let id = this.state.matchID;
    console.log(this.state.seatForm);
    for (let i = 0; i < this.state.seatForm.length; i++) {
      seats.push(this.refs['seat' + i].getData());
    }
    this.setState({seats: seats});
    console.log(this.state)
    let data = {
      'match_id': this.state.matchID,
      'seats': this.state.seats,
      'access_token': this.getParams('access_token')
    };
    axios.post(api + '/match/create', data)
      .then(function (response) {
        if (response.data) {
          window.location.href = vbaRailsEndpoint + '/matches/' + id
        }
      })
      .catch(function (error) {
        alert('Có lỗi trong khi tạo');
        window.location.href = vbaRailsEndpoint + '/matches/' + id
      });
  };

  onCancel = () => {
    window.location.href = vbaRailsEndpoint + '/matches'
  };

  renderSeatForm = () => {
    return (
      <div>
        {
          this.state.seatForm.map((seat, i) => {
            return(
              <SeatForm ref={"seat" + i} key={i} formLength={this.state.seatForm.length} onClick={this.removeForm.bind(i)} seatId={i} seatTypes={this.state.seatTypes}/>
            )
          })
        }
      </div>
      )
  };

  removeForm = (i) => {
    console.log(i);
    this.state.seatForm.splice(i, 1);
    console.log(this.state.seatForm);
    this.setState({seatForm: this.state.seatForm});
  };

  updateMatchID = (e) => {
    this.setState({matchID: parseInt(e.target.value, 10)});
  };

  getMatchInfo = () => {
    let id = this.state.matchIDGet;
    axios.get(api + '/match?match_id=' + id, {})
      .then((response) => {
        this.setState({matchData: response.data});
      })
      .catch((error) => {
      });
  };

  renderSeatMap = () => {
    let matchData = this.state.matchData,
      seatMap = [];
    if (_.isEmpty(matchData)) {
      return;
    } else {
      let seatTypes = this.state.matchData.seatTypes;
      _.forEach(seatTypes, (obj, index) => {
        seatMap.push(
          <div key={index}>
            <h4>{obj.name}</h4>
            <div key='edit'>
              <button onClick={this.toggleEditMode}>Edit</button>
              {this.renderEditForm(index)}
            </div>
            {this.renderSeatMapItem(obj.seats, obj.nameSeat)}
          </div>
        )
      });
      return seatMap;
    }
  };

  renderSeatMapItem = (seats, nameSeat) => {
    let seatsElement = [];
    _.forEach(seats, (obj, index) => {
      seatsElement.push(
        <div key={index}>
          <span>{nameSeat[index]}  </span>
          {this.renderSeats(obj)}
        </div>
      );
    });
    return seatsElement;
  };

  renderSeats = (item) => {
    let itemElement = [];
    _.forEach(item, (obj, index) => {
      itemElement.push(<Seat key={index} name={obj.name} status={obj.status}/>);
    });
    return itemElement;
  };

  updateMatchIDGet = (e) => {
    this.setState({matchIDGet: e.target.value});
  };

  toggleEditMode = () => {
    this.setState({isEdit: !this.state.isEdit});
  };

  renderDisableSeatsSelector = (index) => {
    let disableSeats = [],
      nameSeat = this.state.matchData.seatTypes[index].nameSeat;
    for (let i = 0; i < this.state.disableSeatCount; i++) {
      disableSeats.push(
        <div key={i}>
          <span>Seat Name: </span>
          <select>
            {
              nameSeat.map((value, index) => {
                return (
                  <option key={index} value={value}>{value}</option>
                )
              })
            }
          </select>
          <span>Position: </span>
          <input type='number' min={0}/>
          <button onClick={this.addDisableSeat}>Add</button>
        </div>
      );
    }

    return disableSeats;
  };

  renderEnableSeatsSelector = (index) => {
    let enableSeats = [],
      nameSeat = this.state.matchData.seatTypes[index].nameSeat;
    for (let i = 0; i < this.state.enableSeatCount; i++) {
      enableSeats.push(
        <div key={i}>
          <span>Seat Name: </span>
          <select>
            {
              nameSeat.map((value, index) => {
                return (
                  <option key={index} value={value}>{value}</option>
                )
              })
            }
          </select>
          <span>Position: </span>
          <input type='number' min={0}/>
          <button onClick={this.addEnableSeat}>Add</button>
        </div>
      );
    }

    return enableSeats;
  };

  renderEditForm = (index) => {
    if (this.state.isEdit) {
      return (
        <div>
          <div>
            <h5>Enable Seats </h5>
            <button onClick={this.addEnableSeatSelector}>Add</button>
            {this.renderEnableSeatsSelector(index)}
          </div>
          <div>
            <h5>Disable Seats </h5>
            <button onClick={this.addDisableSeatSelector}>Add</button>
            {this.renderDisableSeatsSelector(index)}
          </div>
          <button onClick={() => this.updateSeatStatus(index)}>Confirm</button>
        </div>
      );
    }
  };

  addEnableSeatSelector = () => {
    this.setState({enableSeatCount: this.state.enableSeatCount + 1});
  };

  addDisableSeatSelector = () => {
    this.setState({disableSeatCount: this.state.disableSeatCount + 1});
  };

  addDisableSeat = (e) => {
    let nameSeat = e.target.closest('div').getElementsByTagName('select')[0],
      position = e.target.closest('div').getElementsByTagName('input')[0],
      seat = nameSeat.value + '-' + position.value,
      disableSeats = this.state.disableSeats;
    disableSeats.push(seat);
    disableSeats = _.uniq(disableSeats);
    this.setState({disableSeats: disableSeats});
  };

  addEnableSeat = (e) => {
    let nameSeat = e.target.closest('div').getElementsByTagName('select')[0],
      position = e.target.closest('div').getElementsByTagName('input')[0],
      seat = nameSeat.value + '-' + position.value,
      enableSeats = this.state.enableSeats;
    enableSeats.push(seat);
    enableSeats = _.uniq(enableSeats);
    this.setState({enableSeats: enableSeats});
  };

  updateSeatStatus = (index) => {
    let data = {
      'seat_id': this.state.matchData.seatTypes[index]._id,
      'position_enabled': this.state.enableSeats,
      'position_disabled': this.state.disableSeats,
    };
    console.log(data);
    axios.post(api + '/match/seat', data)
      .then((response) => {
        console.log(response)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  render() {
    return (
      <div className={'container'}>
        <div className='col-md-12'>
          <h3 className='text-center'>Create seats for match</h3>
          <div>
            <button className='btn btn-outline-secondary' onClick={this.addSeatForm}>Add Seat Type</button>
          </div>
          <div>
            {this.renderSeatForm()}
          </div>
          <div className='text-center form-action'>
            <button className='btn btn-outline-success' onClick={this.onSave}>Save</button>
            <button className='btn btn-outline-warning' onClick={this.onCancel}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
