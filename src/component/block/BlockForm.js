import React, {Component} from 'react';
import './BlockForm.css';

class BlockForm extends Component {
  constructor() {
    super();
    this.state = {
      startNumber: 0,
      direction: 0,
      unavailableSeatsCount: 0,
      rowNames: [],
      unavailableSeats: [],
      startRow: 1,
      endRow: 1,
      startCol: 1,
      endCol: 1
    }
  }

  componentWillReceiveProps() {
  }

  addUnavailableSeatSelector = () => {
    if (this.state.row <= 0) {
      alert("You haven't created any row");
    } else {
      this.setState({unavailableSeatsCount: this.state.unavailableSeatsCount + 1});
    }
  };

  getData = () => {
    let data = {
      'startNumber': parseInt(this.state.startNumber, 10),
      'direction': parseInt(this.state.direction, 10),
      'unavailableSeatsCount': parseInt(this.state.unavailableSeatsCount, 10),
      'rowNames': this.state.rowNames,
      'unavailableSeats': this.state.unavailableSeats,
      'startRow': parseInt(this.state.startRow, 10),
      'endRow': parseInt(this.state.endRow, 10),
      'startCol': parseInt(this.state.startCol, 10),
      'endCol': parseInt(this.state.endCol, 10),
    }
    return data
  }

  renderSeatRowNames = () => {
    let rowLength = this.state.endRow - this.state.startRow + 1;
    let rowNames = [];
    if (rowLength > 0) {
      for (let i = 0; i < rowLength; i++) {
        rowNames.push(
          <div className='form-group' key={i}>
            <input className='form-control' type='text' onChange={(e) => this.updateSeatRowName(i, e)}/>
          </div>
        )
      }
    }
    return rowNames;
  };

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
          <button className='btn btn-outline-secondarys' onClick={this.addUnavailableSeat}>Add</button>
        </div>
      );
    }

    return unavailableSeats;
  };
  renderRemoveBtn = () => {
    if (this.props.parent.blocks.length > 1)
      return (
        <div className='card-header'>
          <button className='btn btn-outline-danger float-right' onClick={this.props.onClick}>Remove Block</button>
        </div>
      )
  };
  renderRemoveBlockBtn = (i) => {
    if (this.state.blocks.length > 1)
      return (
        <div className='card-header'>
          <button className='btn btn-outline-danger float-right' onClick={this.removeBlock.bind(i)}>Remove Block {i}</button>
        </div>
      )
  }


  updateDirection = (e) => {
    this.setState({direction: e.target.value});
  }

  updateStartNumber = (e) => {
    this.setState({startNumber: e.target.value});
  }

  updateRowStart = (e) => {
    this.setState({startRow: e.target.value});
  }

  updateRowEnd = (e) => {
    this.setState({endRow: e.target.value});
  }

  updateColStart = (e) => {
    this.setState({startCol: e.target.value});
  }

  updateColEnd = (e) => {
    this.setState({endCol: e.target.value});
  }

  updateSeatRowName = (i, e) => {
    let rowNames = this.state.rowNames;
    rowNames[i] = e.target.value;
    this.setState({rowNames: rowNames});
  }

  addUnavailableSeat = (e) => {
    let rowName = e.target.closest('div').getElementsByTagName('select')[0],
      position = e.target.closest('div').getElementsByTagName('input')[0],
      seat = rowName.value + '-' + position.value,
      unavailableSeats = this.state.unavailableSeats;
    unavailableSeats.push(seat);
    console.log(seat);
    console.log(unavailableSeats);
    this.setState({unavailableSeats: unavailableSeats});
    alert('Set thành công');
  };

  render() {
    return (
      <div className='card'>
        {this.renderRemoveBtn()}
        <div className='card-body'>
          <div className="row">
            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Row start:</label>
              <div className='col-sm-8'>
                <input type="number" className="form-control" min={1} defaultValue={1} onChange={this.updateRowStart}/>
              </div>
            </div>

            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Row end:</label>
              <div className='col-sm-8'>
                <input type="number" className="form-control" min={1} defaultValue={1} onChange={this.updateRowEnd}/>
              </div>
            </div>
          </div>

          <div className="row">
            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Col start:</label>
              <div className='col-sm-8'>
                <input type="number" className="form-control" min={1} defaultValue={1} onChange={this.updateColStart}/>
              </div>
            </div>

            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Col end:</label>
              <div className='col-sm-8'>
                <input type="number" className="form-control" min={1} defaultValue={1} onChange={this.updateColEnd}/>
              </div>
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
            <label className='col-sm-3 col-form-label'>Start number:</label>
            <div className='col-sm-9'>
              <input className="form-control" type='number' min={1} onChange={this.updateStartNumber}/>
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
      </div>
    )
  }
}

export default BlockForm;