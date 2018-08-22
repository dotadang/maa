import React from 'react'
import update from 'react-addons-update';
import Eos from 'eosjs'
import { Panel, Label } from 'react-bootstrap';
import EosClient from '../eos-client.jsx';
import '../style/base.css';
import '../style/custom.css';
import getCountdownTime from '../tool/dateTool.js';


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
  	});

  }

  render() {
    var lastUser = ''
    if (this.state.data && this.state.data.latestInputUser)
    {
      lastUser = Eos.modules.format.decodeName(this.state.data.latestInputUser, false);
    }
  	const html = this.state.data ? (
      <div className='rounded-0 text-center text-light teaser-cover'>
        <div className='container'>
          <h1 className="display-1 scammed h1white">MY EOS EXIT SCAMMING</h1>
        <h2 className='display-3'>
          <span className='ethglitch titleglow'>Bonus: {this.state.data.bonos / 10000} EOS</span>
          <span className='headtimer'>{getCountdownTime(this.state.data.latestInputTime)}</span>
        </h2>
        </div>
        <p className='subinfo'>latest input id： {this.state.data.latestInputId}</p>
        <p className='subinfo'>cash： {this.state.data.cash}</p>
        <p className='subinfo'>latest input user： {lastUser}</p>
        <a href="javascript:void(0)" className="buyOneTicket btn btn-lg btn-block btn-purp pulse marginb"> 
          <div className="row"> 
            <div className="col-sm-1.5 no-mobile"> SEND EOS</div> 
          </div> 
        </a>     
      </div>
        ) : (<div></div>);

  	return (
		  html
  		);
  }
}
module.hot.accept();