import React, {Component} from 'react';

const moment = require('moment');

class FoundUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      id: this.props.id,
      username: this.props.username,
      password: this.props.password,
      active: this.props.active,
      category: this.props.category,
      surname: this.props.surname,
      name: this.props.name,
      gender: this.props.gender,
      dob: this.props.dob,
      hand: this.props.hand,
      group: this.props.group,
      year: this.props.year,
      saved: null,
      confirmation: false,
    };
  }

  delete = async (e) => {
    const id = this.state.id;
    let resp = await fetch('/users/delete', {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id}),
    });
    const res = await resp.json();
    this.setState({loading: true});
    if (res.succeed) {
      this.setState({loading: false});
      this.props.fetch();
    } else {
      this.setState({loading: false});
    }
  };

  switchStatus = async (e) => {
    this.setState({saved: null});
    const id = this.state.id;
    let resp = await fetch('/users/switch_status', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id}),
    });
    const res = await resp.json();
    this.setState({loading: true});
    if (res.succeed) {
      this.setState({loading: false, active: !this.state.active, saved: true});
    } else {
      this.setState({loading: false, active: this.props.active, saved: false});
    }
  };

  editMode = () => {
    this.setState({edit: !this.state.edit, saved: null});
    this.setState(this.props);
  };

  changeValue = (e) => {
    this.setState({[e.target.name]: e.target.value});
  };

  save = async () => {
    try {
      const {id, username, password, category, surname, name, gender, dob, hand, group, year} = this.state;
      let body;
      if (this.state.category === 'Студент') {
        body = {
          id,
          username,
          password,
          category,
          surname,
          name,
          gender,
          dob,
          hand,
          group,
          year,
        };
      } else {
        body = {
          id,
          username,
          password,
          category,
          surname,
          name,
          gender,
          dob,
          hand,
        };
      }
      let resp = await fetch('/users/edit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      const res = await resp.json();
      if (res.succeeded) {
        this.setState({saved: true});
        this.setState({edit: false});
      } else {
        this.setState({saved: false});
        this.setState(this.props);
      }
    } catch (e) {
      this.setState({saved: false});
      this.setState(this.props);
    }
  };

  render() {
    return (
        <div id={this.props.id}>
          <hr/>
          <div>
            <div className={'attributesBox'}>
              <div className={'leftBlock'}>
                <div className={'attribute'}> Имя:
                  {this.state.edit ?
                      <div><input className={'input textEdit'} name="surname"
                                  placeholder="Фамилия"
                                  value={this.state.surname}
                                  onChange={this.changeValue}/><input
                          className={'input textEdit'} name="name"
                          placeholder="Имя" value={this.state.name}
                          onChange={this.changeValue}/></div>
                      :
                      <div
                          className={'text'}> {this.state.surname} {this.state.name}</div>
                  }
                </div>
                <div className={'attribute'}> Категория:
                  {this.state.edit ?
                      <div>
                        <select className={'selector textEdit'}
                                value={this.state.category}
                                name="category" onChange={this.changeValue}>
                          <option>Студент</option>
                          <option>Дипломник</option>
                          <option>Преподаватель</option>
                        </select>
                      </div>
                      :
                      <div className={'text'}>{this.props.category}</div>
                  }
                  {this.props.active === false ?
                      <div className={'text'}>отключен</div> :
                      <div/>}
                </div>
                < div
                    className={'attribute'}> Идентификатор: {this.state.edit ?
                    <div><input className={'input textEdit'} name="username"
                                value={this.state.username}
                                onChange={this.changeValue}/></div> :
                    <div className={'text'}>{this.props.username}</div>}</div>
                <div className={'attribute'}>Пароль: {this.state.edit ?
                    <div><input className={'input textEdit'} name="password"
                                value={this.state.password}
                                onChange={this.changeValue}/></div> :
                    <div className={'text'}>{this.props.password}</div>}</div>
              </div>
              <div>
                <div className={'attribute'}>
                  {this.props.category === 'Студент' ?
                      <div>
                        <div className={'studentBox'}>
                          <div className={'attribute'}>
                            Группа: {this.state.edit ?
                              <div><input className={'input textEdit'}
                                          name="group"
                                          value={this.state.group}
                                          onChange={this.changeValue}/></div> :
                              <div className={'text'}>{this.props.group}</div>}
                          </div>
                        </div>
                        <div className={'studentBox'}>
                          <div className={'attribute'}>
                            Год: {this.state.edit ?
                              <div><input className={'input textEdit'}
                                          name="year"
                                          value={this.state.year}
                                          onChange={this.changeValue}/></div> :
                              <div className={'text'}>{this.props.year}</div>}
                          </div>
                        </div>
                      </div>
                      : <div/>}
                </div>
                <div className={'attribute'}>Пол: {this.state.edit ?
                    <div>
                      <select className={'selector textEdit'}
                              value={this.state.gender}
                              name="gender" onChange={this.changeValue}>
                        <option>Мужской</option>
                        <option>Женский</option>
                      </select>
                    </div>
                    :
                    <div className={'text'}>{this.props.gender}</div>}</div>
                <div className={'attribute'}>Дата рождения: {this.state.edit ?
                    <div><input className={'input textEdit'}
                                value={moment(this.state.dob).format('YYYY-MM-DD')}
                                name="dob" onChange={this.changeValue}
                                type="date"/>
                    </div> :
                    <div className={'text'}>{moment(this.state.dob).format('DD.MM.YYYY')}</div>}</div>
                <div className={'attribute'}>Рука: {this.state.edit ?
                    <div><select className={'selector textEdit'}
                                 value={this.state.hand}
                                 name="hand" onChange={this.changeValue}>
                      <option>Правша</option>
                      <option>Левша</option>
                    </select></div> :
                    <div className={'text'}>{this.props.hand}</div>}</div>
              </div>
            </div>
            <div>
              {this.state.edit ?
                  <div className={'btnRow'}>
                    {this.state.saved === false ?
                        <div>При сохранении произошла ошибка</div> :
                        <div/>}
                    <div className={'button'} onClick={this.save}>Сохранить
                    </div>
                    <div className={'button'} onClick={this.editMode}>Отмена
                    </div>
                  </div>
                  :
                  <div className={'btnRow'}>
                    {this.state.saved === true ?
                        <div>Изменения сохранены</div> :
                        <div/>}
                    <div className={'button'}
                         onClick={this.editMode}>Редактировать
                    </div>
                    {this.state.active ?
                        <div className={'button'}
                             onClick={this.switchStatus}>Отключить</div> :
                        <div className={'button'}
                             onClick={this.switchStatus}>Включить</div>}
                    <div className={'button'} onClick={this.delete}>Удалить
                    </div>
                  </div>
              }
            </div>
          </div>
        </div>

    );
  }
}

export default FoundUser;
