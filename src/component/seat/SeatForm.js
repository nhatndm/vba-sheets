import React, {Component} from 'react';
import axios from 'axios';
import './SeatForm.css';
import BlockForm from '../block/BlockForm'
const api = 'http://192.168.3.54:3000/api/v1';
const vbaRailsEndpoint = 'http://localhost:3000';

class SeatForm extends Component {
  constructor() {
    super();
    this.state = {
      name: '',
      row: 0,
      col: 0,
      blocks: [{}]
    }
  }

  componentWillMount() {
    this.setState({name: this.props.seatTypes[0]});
  }

  addBlock = () => {
    this.state.blocks.push({});
    this.setState({blocks: this.state.blocks})
  };

  getData = () => {
    let blocks = [];
    console.log(blocks)
    for (let i = 0; i < this.state.blocks.length; i++) {
      console.log(this.refs['block' + i].getData())
      blocks.push(this.refs['block' + i].getData());
    }

    let data = {
      'name': this.state.name,
      'row': parseInt(this.state.col),
      'col': parseInt(this.state.row),
      'blocks': blocks
    }

    return data;
  };

  updateName = (e) => {
    this.setState({name: e.target.value});
  };

  updateColValue = (e) => {
    this.setState({col: e.target.value});
  };

  removeBlock = (i) => {
    this.state.blocks.splice(i, 1);
    this.setState({blocks: this.state.blocks});
  };

  renderRemoveBtn = () => {
    if (this.props.formLength > 1)
      return (
        <div className='card-header'>
          <button className='btn btn-outline-danger float-right' onClick={this.props.onClick}>Remove</button>
        </div>
      )
  };

  updateRowValue = (e) => {
    this.setState({row: e.target.value});
  }

  renderBlock = () => {
    return (
      <div>
        {
          this.state.blocks.map((block, i) => {
            return(
              <BlockForm key={i} parent={this.state} onClick={this.removeBlock.bind(i)} ref={"block" + i}>
              </BlockForm>
            )
          })
        }
      </div>
    )
  }

  render() {
    return (
      <div className='card'>
        {this.renderRemoveBtn()}
        <div className='card-body'>
          <div className="row">
            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Type:</label>
              <div className='col-sm-8'>
                <select onChange={this.updateName} defaultValue={this.props.seatTypes[0]} className='form-control'>
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
          </div>

          <div className="row">
            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Number of row:</label>
              <div className='col-sm-8'>
                <input type="number" className="form-control" min={0} defaultValue={0} onChange={this.updateRowValue}/>
              </div>
            </div>

            <div className='form-group col-md-6 row'>
              <label className='col-sm-4 col-form-label'>Number of column:</label>
              <div className='col-sm-8'>
                <input type="number" className="form-control" min={0} defaultValue={0} onChange={this.updateColValue}/>
              </div>
            </div>
          </div>

          <button className='btn btn-outline-secondary' onClick={this.addBlock}>Add Block</button>

          <div>
            {this.renderBlock()}
          </div>
        </div>
      </div>
    );
  }
}

export default SeatForm;