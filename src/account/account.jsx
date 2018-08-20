import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,Label } from 'react-bootstrap';
import { EosClient } from '../scatter-client.jsx';

export default class AccountLookup extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handlePubkey = this.handlePubkey.bind(this);
    this.handleName = this.handleName.bind(this);

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

  componentWillMount() {
      this.lookupByName();
  }

  handlePubkey(e) {
    this.setState({ pubkey: e.target.value });
  }

  handleName(e) {
    this.setState({ name: e.target.value });
  }

  lookupAccountsByKey(e) {
    e.preventDefault();
    this.setState({accounts:[]});
    this.setState({loading:true, error:false});
    this.state.eos.getKeyAccounts(this.state.pubkey).then((data) => {
      data.account_names.map((name) => {this.getAccountDetail(name)});
    }).catch((e) => {
      console.error(e);
      this.setState({loading:false, error:true});
    })
  }

  lookupAccountsByName(e) {
    e.preventDefault();
    this.setState({accounts:[]});
    this.setState({loading:true, error:false});
    this.getAccountDetail(this.state.name);
  }

  lookupByName() {
    this.setState({accounts:[]});
    this.setState({loading:true, error:false});
    this.getAccountDetail(this.props.accountName);
  }

  getAccountDetail(name) {
    this.state.eos.getAccount(name).then((data) => {
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
    });

    this.state.eos.getCurrencyBalance({ code: "eosmaatoken4", account: name, symbol: "MAA" }).then(data =>{
      this.setState({maa: data[0]});
      });

    this.state.eos.getCurrencyBalance({ code: "eosio.token", account: name, symbol: "EOS" }).then(data =>{
      this.setState({eosamount: data[0]});
      });

  }

  renderPermission(permission) {
    const keys = permission.required_auth.keys.map((k)=>{
      let key = {
        perm_name: permission.perm_name,
        key: k.key,
        weight: k.weight,
      }
      return key;
    });
    const renderKey = (k) => {
      return (
        <tr key={k.perm_name}>
          <td>{k.perm_name}</td>
          <td>{k.key}</td>
          <td>{k.weight}</td>
        </tr>
      );
    }
    return (
        keys.map(renderKey.bind(this))
    );
  }

  renderAccount(account) {
    return (
      // <ListGroupItem key={account.account_name}>{account.account_name}</ListGroupItem>
      <Panel bsStyle="info" key={account.account_name}>
        <Panel.Heading>
          <Panel.Title componentClass="h3"><b>{account.account_name}</b></Panel.Title>
        </Panel.Heading>
        <Panel.Body>
        <div>
            <h3>可用EOS: {this.state.eosamount}</h3>
            <h3>可用MAA: {this.state.maa}</h3>
          
        </div>
        </Panel.Body>
      </Panel>
    );
  }

  render() {
    const isError = this.state.error;
    const isLoading = this.state.loading;
    return (
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
              this.state.accounts.map(this.renderAccount.bind(this))
            )
          )}
        </div>
      </div>
    );
  }
}
module.hot.accept();
