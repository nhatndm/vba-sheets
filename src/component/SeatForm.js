import React, {Component} from 'react';
import axios from 'axios';
import './SeatForm.css';

const api = 'http://192.168.3.54:3000/api/v1';
const vbaRailsEndpoint = 'http://localhost:3000';

class SeatForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      row: 0,
      col: 0,
      startNumber: 0,
      direction: 0,
      unavailableSeatsCount: 0,
      rowNames: [],
      unavailableSeats: [],
    }
  }

  componentWillMount(){
    console.log(this.props);
  }

  addUnavailableSeatSelector = () => {
    if (this.state.row <= 0) {
      alert("You haven't created any row");
    } else {
      this.setState({unavailableSeatsCount: this.state.unavailableSeatsCount + 1});
    }
  }

  onRemove = () => {
    // console.log(this.props.idProps);
  }

  renderSeatRowNames = () => {
    let rowNames = [];
    for (let i = 0; i < this.state.row; i++) {
      rowNames.push(
        <div className='form-group' key={i}>
          <input className='form-control' type='text' onChange={(e) => this.updateSeatRowName(i, e)}/>
        </div>
      )
    }
    return rowNames;
  }

  renderUnavailableSeatsSelector = () => {
    let unavailableSeats = [];

    for (let i = 0; i < this.state.unavailableSeatsCount; i++) {
      unavailableSeats.push(
        <div className='col-md-12 row' key={i}>
          <div className='col-md-5 row form-group'>
            <label className='col-md-4 col-form-label'>Row:</label>
            <div className='col-md-8'>
              <select className='form-control'>
                {
                  this.state.rowNames.map((value, index) => {
                    return (
                      <option key={index} value={value}>{value}</option>
                    )
                  })
                }
              </select>
            </div>
          </div>
          <div className='col-md-6 row form-group'>
            <label className='col-md-4 col-form-label'>
              Position:
            </label>
            <div className='col-md-8'>
              <input className='form-control' type='number' min={0}></input>
            </div>
          </div>
          <div className='col-md-1'>
            <button className='btn btn-outline-secondary' onClick={this.addUnavailableSeat}>Add</button>
          </div>
        </div>
      );
    }

    return unavailableSeats;
  }

  updateRowValue = (e) => {
    this.setState({row: e.target.value});
    if (this.state.rowNames.length === 0) {
      let rowNames = this.state.rowNames;
      for (let i = 0; i < e.target.value; i++) {
        rowNames.push('');
      }
      this.setState({rowNames: rowNames});
    }
    if (this.state.rowNames.length > parseInt(e.target.value, 10)) {
      let rowNames = this.state.rowNames;
      rowNames.splice(e.target.value);
      this.setState({rowNames: rowNames});
    }
  }

  updateSeatRowName = (i, e) => {
    let rowNames = this.state.rowNames;
    rowNames[i] = e.target.value;
    this.setState({rowNames: rowNames});
  }

  getData = () => {
    let data = {
      'name': this.state.name,
      'number_of_x': parseInt(this.state.col, 10),
      'number_of_y': parseInt(this.state.row, 10),
      'start_number': parseInt(this.state.startNumber, 10),
      'direction': parseInt(this.state.direction, 10),
      'name_seat': this.state.rowNames,
      'positionSpecific': this.state.unavailableSeats
    }

    return data;
  }

  updateName = (e) => {
    this.setState({name: e.target.value});
  }

  updateDirection = (e) => {
    this.setState({direction: e.target.value});
  }

  updateStartNumber = (e) => {
    this.setState({startNumber: e.target.value});
  }

  updateColValue = (e) => {
    this.setState({col: e.target.value});
  }

  addUnavailableSeat = (e) => {
    let rowName = e.target.closest('div').getElementsByTagName('select')[0],
      position = e.target.closest('div').getElementsByTagName('input')[0],
      seat = rowName.value + '-' + position.value,
      unavailableSeats = this.state.unavailableSeats;
    unavailableSeats.push(seat);
    this.setState({unavailableSeats: unavailableSeats});
  }

  render() {
    return (
      <div className='card'>
        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Type:</label>
          <div className='col-sm-9'>
            {/*<input type="text" className="form-control" onChange={this.updateName}/>*/}

            <select onChange={this.updateName} defaultValue={0} className='form-control'>
              {
                this.props.seatTypes.map((value, index) => {
                  return (
                    <option key={index} value={value}>{value}</option>
                  )
                })
              }
            </select>
          </div>
        </div>

        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Number of row:</label>
          <div className='col-sm-9'>
            <input type="number" className="form-control" min={0} defaultValue={0} onChange={this.updateRowValue}/>
          </div>
        </div>

        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Number of column:</label>
          <div className='col-sm-9'>
            <input type="number" className="form-control" min={0} defaultValue={0} onChange={this.updateColValue}/>
          </div>
        </div>

        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Start number:</label>
          <div className='col-sm-9'>
            <input className="form-control" type='number' min={0} onChange={this.updateStartNumber}/>
          </div>
        </div>

        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Seat row name:</label>
        </div>

        <div className='form-group row'>
          <div className='offset-md-3 col-sm-9'>
            {this.renderSeatRowNames()}
          </div>
        </div>

        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Direction:</label>
          <div className='col-sm-9'>
            <select className="form-control" defaultValue={0} onChange={this.updateDirection}>
              <option value={0}>Left to right</option>
              <option value={1}>Right to left</option>
            </select>
          </div>
        </div>

        <div className='form-group row'>
          <label className='col-sm-3 col-form-label'>Unavailable Seats::</label>
          <div className='col-sm-9'>
            <button className='btn btn-outline-secondary' onClick={this.addUnavailableSeatSelector}>Add</button>
          </div>
        </div>

        <div className='form-group row'>
          {this.renderUnavailableSeatsSelector()}
        </div>
      </div>
    );
  }
}

export default SeatForm;