import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,Label } from 'react-bootstrap';
import { EosClient } from '../scatter-client.jsx';
import Eos from 'eosjs'

export default class AccountLookup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      error: false,
      pubkey: '',
      name: '',
      accounts: [],
      eos: EosClient(),
      maa: '',
      eosamount: '',
      userinfo: '',
      income: ''
    };

  }

  componentDidMount() {
      this.lookupByName();
  }

  lookupByName() {
    this.setState({accounts:[]});
    this.setState({loading:true, error:false});
    this.getAccountDetail(this.props.accountName);
  }

  getAccountDetail(name) {
    if (!name)
    {
      this.setState({loading:false, error:false});
      return;
    }

    this.state.eos.getCurrencyBalance({ code: "eosmaatoken4", account: name, symbol: "MAA" }).then(data =>{
      this.setState({maa: data[0]});
      //console.log(data[0]);
      });

    this.state.eos.getCurrencyBalance({ code: "eosio.token", account: name, symbol: "EOS" }).then(data =>{
      this.setState({eosamount: data[0]});
      //console.log(data[0]);
      });

    const bigName = Eos.modules.format.encodeName(name, false);
    const userinfo = {
      json: true,
      scope: "eosmaacont44",
      code: "eosmaacont44",
      table: "userinfo",
      table_key: 'userName',
      lower_bound: bigName,
      limit: 10
    };

    this.state.eos.getTableRows(userinfo).then((table) => {
      const filteredRows = table.rows.filter((row) => row.userName === bigName);
      if (filteredRows.length === 1)
      {
        this.setState({userinfo: filteredRows[0]});
      }
    }).catch((error) => {
      console.log(error);
    });

    const income = {
      json: true,
      scope: "eosmaacont44",
      code: "eosmaacont44",
      table: "income",
      table_key: 'userName',
      lower_bound: bigName,
      limit: 10
    };


    this.state.eos.getTableRows(income).then((table) => {
      const filteredRows = table.rows.filter((row) => row.userName === bigName);
      if (filteredRows.length === 1)
      {
        this.setState({income: filteredRows[0]});
      }
    }).catch((error) => {
      console.log(error);
    });

    
    this.setState({loading:false, error:false});
  }

  renderAccount(account) {
    return (
      // <ListGroupItem key={account.account_name}>{account.account_name}</ListGroupItem>
      <Panel bsStyle="info" key={this.props.accountName}>
        <Panel.Heading>
          <Panel.Title componentClass="h3"><b>{this.props.accountName}</b></Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        <div>
            <div>
              <Button type="submit" bsStyle="warning">Active</Button>
              {'  '}
              <Button type="submit" bsStyle="warning">Input</Button>
            </div>
            <h4>可用EOS: {this.state.eosamount}</h4>
            <h4>可用MAA: {this.state.maa}</h4>
            <h4>Input Quant: {this.state.income.inputQuant / 10000} EOS</h4>
            <h4>Input Time: {this.state.income.inputTime}</h4>
            <h4>Refer User: {this.state.userinfo.referUser}</h4>
            <h4>Level: {this.state.userinfo.level}</h4>
          
        </div>
        </Panel.Body>
      </Panel>
    );
  }

  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    //const account = this.renderAccount();
    return this.props.accountName ? (
      <div>
        <div>
          {isError ? (
            <Alert bsStyle="warning">
              <strong>No results!</strong> The public key or name provided may be invalid or does not exist.
            </Alert>
          ) : (
            isLoading ? (
              <ProgressBar active now={100} label='Querying Network'/>
            ) : (
              this.renderAccount()
            )
          )}
        </div>
      </div>
    ) : (<div></div>);
  }
}
module.hot.accept();
