import React from 'react'
import update from 'react-addons-update';
import { Grid, Row, Col, Panel, Form, FormGroup, FormControl, ControlLabel, HelpBlock,ListGroup,ListGroupItem, Button, ProgressBar, Alert, Table,Label } from 'react-bootstrap';
import { EosClient } from '../scatter-client.jsx';
import Eos from 'eosjs';
import '../style/base.css';
import '../style/custom.css';
import formatDate from '../tool/dateTool.js';

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
      active: false,
      eosamount: '',
      userinfo: null,
      income: '',
      lastInputId: -1
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
        this.setState({userinfo: filteredRows[0], active: true});
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

  //为自己激活账号
  active(e) {
    e.preventDefault();
    const transaction = [
      {
        account: 'eosmaatoken4',
        name: 'transfer',
        authorization: [{
                    actor: this.props.accountName,
                    permission: this.props.authority
                }],
        data: {
          from: this.props.accountName,
          to: 'eosmaacont44',
          memo: this.props.accountName,
          quantity: '1 MAA'
        },
      },
    ];

    console.log(transaction);
    //this.setState({loading:true, error:false});
    this.state.eos.transaction({actions:transaction}).then((data) => {
      //console.log(data.transaction_id);
      this.setState({loading:false, error:false});
    }).catch((e) => {
      console.log(e);
      this.setState({loading:false, error:true});      
    });
  }

  getLastInputId() {
    const maa = {
      json: true,
      scope: "eosmaacont44",
      code: "eosmaacont44",
      table: "context",
      limit: 10
    };

    this.state.eos.getTableRows(maa).then((table) => {
        return table.rows[0].latestInputId;
    }).catch((e) =>
    {
      return - 1;
    });
  }

  //转账EOS
  sendEOS(e) {
    e.preventDefault();

    const maa = {
      json: true,
      scope: "eosmaacont44",
      code: "eosmaacont44",
      table: "context",
      limit: 10
    };

    this.state.eos.getTableRows(maa).then((table) => {
        var lastInputId = table.rows[0].latestInputId;
        var inputEOS = ((10000 + lastInputId * 100) / 10000).toFixed(4);
        const transaction = [
          {
            account: 'eosio.token',
            name: 'transfer',
            authorization: [{
                        actor: this.props.accountName,
                        permission: this.props.authority
                    }],
            data: {
              from: this.props.accountName,
              to: 'eosmaacont44',
              memo: this.props.accountName,
              quantity: inputEOS +' EOS'
            },
          },
        ];

        this.state.eos.transaction({actions:transaction}).then((data) => {
          //console.log(data.transaction_id);
          this.setState({loading:false, error:false});
        }).catch((e) => {
          console.log(e);  
        });

    }).catch((e) => {
      console.log(e);
    });
  
  }

  renderAccount(account) {
    var referUser = '';
    var level = '';
    if (this.state.userinfo)
    {
      referUser = Eos.modules.format.decodeName(this.state.userinfo.referUser, false);
      level = this.state.userinfo.level;
    }

    const activeMe = this.state.userinfo ? ( <div></div> ) : ( 
      this.state.active ? <Button type="button" onClick={this.active.bind(this)}>Active Me</Button> : <div></div>);
    const activeFriend = this.state.userinfo ? (
      <Form inline>
                <FormGroup>
                  <ControlLabel className='lead nomarginb'>Name: </ControlLabel>{' '}
                  <FormControl type="text" placeholder="eosdotadang1" />
                </FormGroup>{' '}
                {' '}
                <Button>Active My Friend</Button>
              </Form>
      ) : ( <div></div>);
    return (
      <div className='container'>
        <div className='row'>
          <div className='col-sm colstyle'> 
            <div className='tab-pane show active'>
              <div className='accountinfo'>
              
              <h4 className='lead nomarginb'>可用EOS: {this.state.eosamount}</h4>
              <h4 className='lead nomarginb'>可用MAA: {this.state.maa}</h4>
              <h4 className='lead nomarginb'>Input Quant: {this.state.income.inputQuant / 10000} EOS</h4>
              <h4 className='lead nomarginb'>Input Time: {Date(this.state.income.inputTime)}</h4>
              <h4 className='lead nomarginb'>Refer User: {referUser}</h4>
              <h4 className='lead nomarginb'>Level: {level}</h4>  
              <br/>
              {activeMe}
              <br/>
              <Button type="button" className='btn-block' onClick={this.sendEOS.bind(this)}>Send EOS</Button>
            </div>
            </div>        
          </div>
          <div className='col-sm colstyle'>
            <div className='tab-content'>           
            
            <div className='tab-pane show active'>
              <div className='accountinfo'>
              <Button type="button" bsStyle="primary">Active</Button>
              {'  '}
              <Button type="button" bsStyle="primary">Input</Button>
              <h4>可用EOS: {this.state.eosamount}</h4>
              <h4>可用MAA: {this.state.maa}</h4>
              <h4>Input Quant: {this.state.income.inputQuant / 10000} EOS</h4>
              <h4>Input Time: {this.state.income.inputTime}</h4>
              <h4>Refer User: {referUser}</h4>
              <h4>Level: {level}</h4>  
            </div>
            </div>
            </div>          
          </div>
        </div>
      </div>
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
