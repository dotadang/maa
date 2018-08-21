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
      eosamount: ''
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
    /*this.state.eos.getAccount(name).then((data) => {
      this.state.eos.getCurrencyBalance('eosio.token',name).then((currency) => {
        data.currency = currency;
        //console.log(data);
        const newAccounts = update(this.state.accounts, {$push: [
          data,
        ]});
        this.setState({ loading:false, error:false, accounts: newAccounts })
      });
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    });*/

    this.state.eos.getCurrencyBalance({ code: "eosmaatoken4", account: name, symbol: "MAA" }).then(data =>{
      this.setState({maa: data[0]});
      //console.log(data[0]);
      });

    this.state.eos.getCurrencyBalance({ code: "eosio.token", account: name, symbol: "EOS" }).then(data =>{
      this.setState({eosamount: data[0]});
      //console.log(data[0]);
      });

    //console.log(Eos.modules.format.encodeName(name, false));
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
            <h4>可用EOS: {this.state.eosamount}</h4>
            <h4>可用MAA: {this.state.maa}</h4>
          
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
