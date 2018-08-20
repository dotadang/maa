import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table, Popover, OverlayTrigger } from 'react-bootstrap';
import { EosClient, bindNameToState } from '../scatter-client.jsx';

export default class TransferToken extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleFrom = this.handleFrom.bind(this);
    this.handleTo = this.handleTo.bind(this);
    this.handleAmount = this.handleAmount.bind(this);

    this.state = {
      loading: false,
      error: false,
      success: '',
      reason: '',
      from: '',
      to: '',
      amount: 0,
      eos: null
    };

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      let client = EosClient();
      this.setState({ eos: client});

      setInterval(() => {
        bindNameToState(this.setState.bind(this), ['from']);
      }, 1000);
    });
  }

  componentDidMount() {
    if(window.scatter !== undefined) {
      this.setState({ eos: EosClient()});
      bindNameToState(this.setState.bind(this), ['from']);
    }
  }

  handleFrom(e) {
    this.setState({ from: e.target.value });
  }

  handleTo(e) {
    this.setState({ to: e.target.value });
  }

  handleAmount(e) {
    this.setState({ amount: e.target.value });
  }

  transfer(e) {
    e.preventDefault();
    const transaction = [
      {
        account: 'eosio.token',
        name: 'transfer',
        authorization: [{
                    actor: this.state.from,
                    permission: 'active'
                }],
        data: {
          from: this.state.from,
          to: this.state.to,
          memo: 'eosmaatest12',
          quantity: '100.0000 EOS'
        },
      },
    ];
    this.setState({loading:true, error:false, reason:''});
    this.state.eos.transaction({actions:transaction}).then((data) => {
      //console.log(data.transaction_id);
      this.setState({loading:false, error:false, success: data.transaction_id});
    }).catch((e) => {
      if (e.message) {
        this.setState({loading:false, error:true, reason: e.message});
      }
      else {
        const error = JSON.parse(e).error;
        if (error.details.length) {
          this.setState({loading:false, error:true, reason: error.details[0].message});
        }
        else{
          this.setState({loading:false, error:true, reason: 'unknow error occurs'})
        }
      }
    });
  }

  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    const isSuccess = this.state.success;

    const RenderStatus = () => {
      if(isError) {
        return (
          <Alert bsStyle="warning">
            <strong>Transaction failed. {this.state.reason}</strong>
          </Alert>
        );
      }

      if(isLoading) {
        return(<ProgressBar active now={100} label='Sending Transaction'/>);
      }

      if(isSuccess !== '') {
        return (
          <Alert bsStyle="success">
            <strong>Transaction sent. TxId: <a href={"https://eospark.com/MainNet/tx/" + isSuccess} target="new">{isSuccess}</a></strong>
          </Alert>
        );
      }
      return('');
    }

    return (
      <div>
        <Form style={{paddingTop: '1em'}}>
          <FormGroup>
            <ControlLabel>Your Account Name</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.from}
              placeholder="Account Name - Linked to Scatter"
              onChange={this.handleFrom}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>To</ControlLabel>{' '}
            <FormControl
              type="text"
              value={this.state.to}
              placeholder="Account Name transfer to"
              onChange={this.handleTo}
            />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Amount (in EOS)</ControlLabel>{' '}
              <FormControl
                type="text"
                value={this.state.bid}
                placeholder="amount"
                onChange={this.handleAmount}
              />
          </FormGroup>{' '}
          <Button type="submit" onClick={this.transfer.bind(this)}>Trasfer</Button>
          
        </Form>
        <div style={{paddingTop: '2em'}}>
          <RenderStatus/>
        </div>
      </div>
    );
  }
}
module.hot.accept();
