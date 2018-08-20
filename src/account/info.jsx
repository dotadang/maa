import React from 'react'
import update from 'react-addons-update';
import Eos from 'eosjs'
import { Panel, Label } from 'react-bootstrap';
import EosClient from '../eos-client.jsx';

export default class ChainInfo extends React.Component {
  constructor(props, context) {
    super(props, context);

    /*this.handleCreator = this.handleCreator.bind(this);
    this.handleName = this.handleName.bind(this);
    this.handleNet = this.handleNet.bind(this);
    this.handleCpu = this.handleCpu.bind(this);
    this.handleTransfer = this.handleTransfer.bind(this);*/

    this.state = {
      loading: false,
      error: false,
      reason: '',
      success: '',
      name: '',
      creator: '',
      net: 0,
      cpu: 0,
      transfer: true,
      eos: EosClient(),
      scatter:null,
      intervalId: 0,
      data: null
    };

    setInterval(() => { this.getMAAInfo(); }, 1000);
	//this.getChainInfo();
	this.getMAAInfo();
  }

  componentDidMount() {
    
  }

  getChainInfo() {
  	this.state.eos.getInfo({}).then((data) => {
/*    	console.log('get eos info');
    	console.log(data);*/
    	this.setState(() => (
		{
			data
		}));
    });
  }

  getMAAInfo() {
  	const maa = {
  	  json: true,
      scope: "eosmaacont44",
      code: "eosmaacont44",
      table: "context",
      limit: 10
  	};

  	this.state.eos.getTableRows(maa).then((table) => {
  		//console.log(table.rows[0]);
  		this.setState({
  			data : table.rows[0]
  		});
  	})

  	const userinfo = {
  	  json: true,
      scope: "eosmaacont44",
      code: "eosmaacont44",
      table: "income",
      limit: 10
  	};

  	this.state.eos.getTableRows(userinfo).then((table) => {
  		//console.log(table.rows);
  	})

  }

  getCountdownTime(timestamp){
  	const now = Date.parse(new Date());
  	const t = timestamp*1000 + 24*60*60*1000 - now;
  	let seconds = Math.floor((t / 1000) % 60)
    let minutes = Math.floor((t / 1000 / 60) % 60)
    let hours = Math.floor((t / (1000 * 60 * 60)) % 24)
    let days = Math.floor(t / (1000 * 60 * 60 * 24))
  	return hours + ":" + minutes + ":" + seconds;
  }

  render() {
  	const html = this.state.data ? (
  		<Panel bsStyle="success">
          <Panel.Heading>
            <Panel.Title componentClass="h3">MAA Status</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
          	<h2>
				<Label bsStyle="success">Bonus: {this.state.data.bonos / 10000} EOS</Label>
				{'  '}
	          	<Label bsStyle="info">Time Left: {this.getCountdownTime(this.state.data.latestInputTime)}</Label>
			</h2>	
	          	<div>latest input id： {this.state.data.latestInputId}</div>
	          	<div>cash： {this.state.data.cash}</div>
	          	<div>latest input user： {this.state.data.latestInputUser}</div>
          	
          </Panel.Body>
          {/*<Panel.Footer>EOS主网信息</Panel.Footer>*/}
        </Panel>
        ) : (<div></div>);
  	return (
		html
  		)
  }
}
module.hot.accept();