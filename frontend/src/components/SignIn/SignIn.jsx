import React, {Component} from 'react';
import  { Redirect } from 'react-router-dom';
/*import {connect} from 'react-redux'
import {AddTodoAC, ChangeStatusAC, EditTaskAC, DeleteTaskAC, UpdateTasksAC} from '../redux/creators'*/
const Cookies = require('js-cookie');

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      logged_in: null,
    }
  };

  refreshUsernameField = (e) => {
    this.setState({username: e.target.value})
  };

  refreshPasswordField = (e) => {
    this.setState({password: e.target.value})
  };

  signIn = async() => {
    // const username = this.state.username;
    // const password = this.state.password;
    // await console.log(username);
    let resp = await fetch('/users/signin', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({...this.state})
    });

    const res = await resp.json();
    console.log(res);
    if (res.user && res.cookie) {
      // this.props.cookie.set({session: true})
      // Cookies.set('logged_in', true);
      // Cookies.set('username', res.username);
      const {_id, username, category, surname, name, gender, dob, hand, group, year} = res.user;
      // Cookies.set('cookie', res.cookie);
      Cookies.set('user_id', _id);
      Cookies.set('username', username);
      Cookies.set('category', category);
      Cookies.set('surname', surname);
      Cookies.set('name', name);
      Cookies.set('gender', gender);
      Cookies.set('dob', dob);
      Cookies.set('hand', hand);
      // Cookies.set('group', group);
      // Cookies.set('year', year);
      console.log('>>> Authorized');
      return <Redirect to='/readme'/>;
    } else {
      alert('Try again')
    }
    await console.log(res);
  };

  render() {
    return (
      <div>
        <div><h1>Вход в систему</h1></div>
        <br/>
        <div>
          <input onChange={this.refreshUsernameField} placeholder="Идентификатор пользователя"/>
        </div>
        <br/>
        <div>
          <input onChange={this.refreshPasswordField} placeholder="Пароль" type="password"/>
        </div>
        {this.state.logged_in === false ? <div>Проверьте логин и пароль</div> : <div/>}
        <br/>
        <div onClick={this.signIn}>Войти</div>
      </div>
    );
  }
}

export default SignIn;
