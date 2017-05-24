import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../actions/auth';
import { withRouter } from 'react-router-dom';

class AuthPage extends Component {
  state = {
    username: '',
    password: '',
    remember_me: false
  }
  
  updateInput(name, value) {
    this.setState({
      [name]: value
    });
  }
  
  renderLoginError() {
    const { errorDescription } = this.props.auth;
    
    if (!errorDescription) {
      return null;
    }
    
    return (
      <div className='error'>
        <p>{errorDescription}</p>
      </div>
    );
  }
  
  renderLoginButton() {
    return this.props.auth.loginPending ? <span><i className="fa fa-spinner fa-spin"></i> Logging In</span> : <span>Log In</span>;
  }
  
  render() {
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
                          <label><input name="remember_me" type="checkbox"
                          checked={this.state.remember_me} onChange={(e) => this.updateInput('remember_me', e.target.checked)} /> Keep me logged in</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row">
                      <div className="col-xs-12">
                        <button className="btn btn-primary btn-loading" id="login-button"
                        type="submit" onClick={(e) => {
                          const { username, password, remember_me } = this.state;
                          e.preventDefault();
                          this.props.login(username, password, remember_me);
                        }}>{this.renderLoginButton()}</button>
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

function mapStateToProps({ auth }) {
  return { auth };
}

export default withRouter(connect(mapStateToProps, { login })(AuthPage));