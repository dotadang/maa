import Eos from 'eosjs'
import React, { Fragment } from 'react'
import update from 'react-addons-update';
import { Button, Label, Panel } from 'react-bootstrap';
import AccountLookup from './account/account.jsx';
import ChainInfo from './account/info.jsx';
import TransferToken from './account/transfer.jsx';
import './style/custom.css';



const network = {
    blockchain:'eos',
    host:'api.eosnewyork.io', // ( or null if endorsed chainId )
    port:443, // ( or null if defaulting to 80 )
    chainId:"aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906", // Or null to fetch automatically ( takes longer )
}

const httpNetwork = {
    blockchain:'eos',
    host:'junglenodes.eosmetal.io', // ( or null if endorsed chainId )
    port:443, // ( or null if defaulting to 80 )
    chainId:"038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca", // Or null to fetch automatically ( takes longer )
}

const eosOptions = {
    broadcast: true,
    sign: true,
    chainId: "038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca",
}

export function EosClient() {
  return window.scatter.eos(httpNetwork,Eos,eosOptions,'https');
}

export const bindNameToState = (stateSetter, paramArray) => {
  const name = window.scatter.identity && window.scatter.identity.accounts.find(x => x.blockchain === 'eos')
      ? window.scatter.identity.accounts.find(x => x.blockchain === 'eos').name
      : '';

  stateSetter(paramArray.reduce((acc, param) => {
    acc[param] = name;
    return acc;
  }, {}));
}

export class ScatterConnect extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      connecting: false,
      error: false,
      scatter: window.scatter,
      identity: null
    }

    document.addEventListener('scatterLoaded', scatterExtension => {
      console.log('Scatter connected')
      // Scatter will now be available from the window scope.
      // At this stage the connection to Scatter from the application is
      // already encrypted.
      this.setState({scatter: window.scatter, identity: window.scatter.identity});

      // It is good practice to take this off the window once you have
      // a reference to it.
      //window.scatter = null;
    })
  }

  connectIdentity() {
      this.state.scatter.getIdentity({accounts:[{chainId:httpNetwork.chainId, blockchain:httpNetwork.blockchain}]}).then(() => {
          console.log('Attach Identity');
          console.log(this.state.scatter.identity);
          this.setState({identity: window.scatter.identity});
      }).catch(error => {
          console.error(error);
      });
  }

  removeIdentity() {
    this.state.scatter.forgetIdentity().then(() => {
      console.log('Detach Identity');
      console.log(this.state.scatter.identity);
      this.setState({identity: window.scatter.identity});
    }).catch((e) => {
      if(e.code === 423) {
        console.log('No identity to detach');
      }
    });
  }

  renderScatter() {
    const id = this.state.identity ? (
            <Label bsStyle="info">Hello {this.state.identity.accounts[0].name}</Label>
        ) : ( <div/>);

    const button = this.state.identity ? (
      <Button type="submit" onClick={this.removeIdentity.bind(this)} bsStyle="warning">Remove Identity</Button>
    )  : (
      <Button type="submit" onClick={this.connectIdentity.bind(this)} bsStyle="info">Attach Identity</Button>
    );

    const account = this.state.identity ? (
      <AccountLookup accountName={this.state.identity.accounts[0].name}/>
      ) : ( <div/>);

    const chainInfo = <ChainInfo/>;

    const tokenTransfer = this.state.identity ? (
          <Panel bsStyle="warning">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Transfer Token</Panel.Title>
          </Panel.Heading>
          <Panel.Body><TransferToken accountName={this.state.identity.accounts[0].name}/></Panel.Body>
        </Panel>
        ) : ( <div/>);

    return (
      <Fragment>
        <div className="blurryboy"></div>
        <h3>{id} {button}</h3>
        {chainInfo}
        {account}
        {/*tokenTransfer*/}      
      </Fragment>
    );
  }

  render() {
      if(this.state.scatter === undefined) {
        return (<h3>Scatter is required to send transactions. <a href="https://scatter-eos.com/" target="new">Install Scatter</a></h3>);
      } else {
        return ( this.renderScatter() );
      }
    }
}
