import React, { Component } from 'react';
import './App.css';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  withRouter
} from 'react-router-dom'

// import cookie from 'js-cookie';
import axios from 'axios';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      rememberMe: false,
      loggedIn: false
    }
  }
  
  updateInput(name, value) {
    this.setState({
      [name]: value
    });
  }
  
  login() {
    const { username, password, rememberMe } = this.state;
    const query = `grant_type=password&username=${username}&password=${password}&rememberMe=${rememberMe}`;
    this.setState({
      error_description: null
    });
    return axios.post('http://api.sparkpost.dev/api/v1/authenticate', query, {
      headers: {
        Authorization: 'Basic bXN5c1dlYlVJOmZhODZkNzJlLTYyODctNDUxMy1hZTdmLWVjOGM4ZmEwZDc2Ng==',
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(({ data }) => {
      this.setState({
        loggedIn: true,
        data,
        username
      });
    })
    .catch(({ response }) => {
      const { error_description = 'An unknown error occurred' } = response.data;
      this.setState({
        loggedIn: false,
        error_description
      });
    });
  }
  
  renderLoginError() {
    if (!this.state.error_description) {
      return null;
    }
    return (
      <div className='error'>
        <p>{this.state.error_description}</p>
      </div>
    );
  }
  
  render() {
    if (this.state.loggedIn) {
      this.props.history.push('/dashboard');
      return null;
    }
    return (
      <div className="join-wrapper">
        <div className="join-content">
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2 col-md-6 col-md-offset-3">
              <h4 className="logo-type margin-bottom-lg text-center"><a href="https://www.sparkpost.com"
              title="SparkPost"><img alt="SparkPost" height="68" src="/assets/images/sparkpost-logo-color.svg" width="188" /></a></h4>
              
              <div className="join-panel">
                <div className="join-panel__body">
                  <h3 className="margin-bottom-xl" id="sp-login-message"><span>Log In</span></h3>

                  <form>
                    
                    {this.renderLoginError()}
                    
                    <div className="row">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <div className="text-muted">Username or Email</div>
                          <input autoFocus={true} className="form-control input-sm form-username"
                          name="username" required={true} value={this.state.username}
                          type="text" onChange={(e) => this.updateInput('username', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row margin-bottom-md">
                      <div className="col-xs-12">
                        <div className="form-group">
                          <div className="text-muted">Password</div>
                          <input className="form-control input-sm form-password"
                          name="password" required={true} value={this.state.password} 
                          type="password" onChange={(e) => this.updateInput('password', e.target.value)} />
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-xs-12 margin-bottom-md">
                        <div className="checkbox small">
                          <label><input name="rememberMe" type="checkbox"
                          checked={this.state.rememberMe} onChange={(e) => this.updateInput('rememberMe', e.target.checked)} /> Keep me logged in</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-xs-12">
                        <button className="btn btn-primary btn-loading" id="login-button"
                        type="submit" onClick={(e) => {
                          e.preventDefault();
                          this.login();
                        }}>Log In<i className="fa fa-spinner fa-spin"></i></button>
                      </div>
                    </div>
                    
                  </form>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const AuthPageRouter = withRouter(AuthPage);

class App extends Component {
  render() {
    return (
      <Router>
        <div className="app-container">
          <Route exact path="/">
            <Redirect to="/auth" />
          </Route>
          <Route path="/auth" component={AuthPageRouter} />
          
          <Route path="/dashboard" render={() => <h1>Dashboard</h1>} />
        </div>
      </Router>
    );
  }
}

export default App;
