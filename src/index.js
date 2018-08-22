import React from 'react'
import ReactDOM from 'react-dom'
import update from 'react-addons-update';
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { Navbar, Nav, NavItem, Panel, Alert, ButtonGroup, Button } from 'react-bootstrap';
import { ScatterConnect } from './scatter-client.jsx';
import { LinkContainer } from 'react-router-bootstrap';
/*import Unlock from './unlock.jsx'
import Tools from './tools/tools.jsx'
import Names from './names/names.jsx'
import Staking from './staking/staking.jsx'*/
import './style.css';

const Home = () => (
  <Redirect from="/" to="/tools" />
);

const Unlock = () => (
  <Redirect from="/" to="/tools" />
);

const Tools = () => (
  <Redirect from="/" to="/tools" />
);

const Names = () => (
  <Redirect from="/" to="/tools" />
);

const Staking = () => (
  <Redirect from="/" to="/tools" />
);

class Toolkit extends React.Component {
  render() {
    return (
      <Router>
      <div>
       <Navbar inverse fixedTop className="navbar">
        <Navbar.Header>
          <Navbar.Brand>
            <a href="https://www.genereos.io" target="new">EOS Toolkit by GenerEOS</a>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>

      <div className="container" role="main">
        <ScatterConnect></ScatterConnect>

            {/*<Route exact path="/" component={Home} />
            <Route path="/tools" component={Tools} />
            <Route path="/names" component={Names} />
            <Route path="/staking" component={Staking} />*/}
{/*		<Panel bsStyle="primary">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Lookup Accounts</Panel.Title>
          </Panel.Heading>
          <Panel.Body><AccountLookup/></Panel.Body>
        </Panel>*/}
        <p style={{float: 'right'}}>Copywrite GenerEOS 2018 | <a href="https://www.genereos.io" target="new">Website</a> | <a href="https://github.com/genereos/eostoolkit" target="new">GitHub</a></p>
      </div>
      </div>
      </Router>
    );
  }
}

ReactDOM.render(<Toolkit />, document.getElementById('app'));

module.hot.accept();
