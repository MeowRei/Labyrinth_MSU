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
      category: this.props.category,
      surname: this.props.surname,
      name: this.props.name,
      gender: this.props.gender,
      dob: this.props.dob,
      hand: this.props.hand,
      group: this.props.group,
      year: this.props.year,
      saved: null,
    }
  }

  delete = async (e) => { // Удаляется, но карточка висит в результатах
      const id = e.target.parentElement.parentElement.parentElement.id;
      let resp = await fetch('/users/delete', {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id})
      });
      const res = await resp.json();
      this.setState({loading: true});
      if (res.succeed) {
        this.setState({loading: false});
        alert('Пользователь удален')
      } else {
        this.setState({loading: false});
        alert('Произошла ошибка')
      }
  };

  switchStatus = async (e) => {
    const id = e.target.parentElement.parentElement.parentElement.id;
    let resp = await fetch('/users/switch_status', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({id})
    });
    const res = await resp.json();
    this.setState({loading: true});
    if (res.succeed) {
      this.setState({loading: false});
      alert('Статус изменен')
    } else {
      this.setState({loading: false});
      alert('Произошла ошибка')
    }
  };

  editMode = () => {
    this.setState({edit: !this.state.edit})
  };

  changeValue = (e) => {
    this.setState({[e.target.name]: e.target.value});
    console.log(this.state.dob)
  };

  save = async () => {
    try {
      const {id, username, password, category, surname, name, gender, dob, hand, group, year} = this.state;
      let body;
      if (this.state.category === 'Студент') {
        body = {id, username, password, category, surname, name, gender, dob, hand, group, year}
      } else {
        body = {id, username, password, category, surname, name, gender, dob, hand}
      }
      let resp = await fetch('/users/edit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
      });
      const res = await resp.json();
      // this.setState({edit: !this.state.edit});
      if (res.succeeded) {
        this.setState({saved: true});
        this.setState({edit: false});
      } else {
        this.setState({saved: false});
        this.setState(this.props)
      }
    } catch (e) {
      this.setState({saved: false});
      this.setState(this.props)
    }
  };

  render() {
    return (
      <div id={this.props.id}>
        <hr/>
        <div>
          <div>
            {this.state.edit ?
                <div><input name="surname" placeholder="Фамилия" value={this.state.surname} onChange={this.changeValue}/><input name="name" placeholder="Имя" value={this.state.name} onChange={this.changeValue}/></div>
                :
                <div>{this.state.surname} {this.state.name}</div>
            }
          </div>
          <div>
            {this.state.edit ?
                <div>
                  <select value={this.state.category} name="category" onChange={this.changeValue}>
                    <option>Студент</option>
                    <option>Дипломник</option>
                    <option>Преподаватель</option>
                  </select>
                </div>
            :
                <div>{this.props.category}</div>
            }
            {this.props.active === false ? <div>отключен</div> : <div/>}
          </div>
          <div>
            {this.props.category === 'Студент' ?
            <div>
            Группа {this.state.edit ? <div><input name="group" value={this.state.group} onChange={this.changeValue}/></div> : <div>{this.props.group}</div>} /
              {this.state.edit ? <div><input name="year" value={this.state.year} onChange={this.changeValue}/> год</div>: <div>{this.props.year} год</div>}
            </div> : <div/>}
          </div>
          <br/>
          <div>Идентификатор: {this.state.edit ? <div><input name="username" value={this.state.username} onChange={this.changeValue}/></div> : <div>{this.props.username}</div>}</div>
          <div>Пароль: {this.state.edit ? <div><input name="password" value={this.state.password} onChange={this.changeValue}/></div> : <div>{this.props.password}</div>}</div>
          <div>Пол: {this.state.edit ?
              <div>
            <select value={this.state.gender} name="gender" onChange={this.changeValue}>
              <option>Мужской</option>
              <option>Женский</option>
            </select>
          </div>
              :
              <div>{this.props.gender}</div>}</div>
          <div>Дата рождения: {this.state.edit ? <div><input value={moment(this.state.dob).format('YYYY-MM-DD')} name="dob" onChange={this.changeValue} type="date"/></div>: <div>{moment(this.state.dob).format('DD.MM.YYYY')}</div>}</div>
          <div>Рука: {this.state.edit ? <div><select value={this.state.hand} name="hand" onChange={this.changeValue}>
            <option>Правша</option>
            <option>Левша</option>
          </select></div> : <div>{this.props.hand}</div>}</div>
          <br/>
          {this.state.edit ?
              <div>
                {this.state.saved === false ? <div>При сохранении произошла ошибка</div> : <div/>}
                <div onClick={this.save}>Сохранить</div>
                <div onClick={this.editMode}>Отмена</div>
              </div>
              :
              <div>
                {this.state.saved === true ? <div>Изменения сохранены</div> : <div/>}
                <div onClick={this.editMode}>Редактировать</div>
                <div onClick={this.switchStatus}>Отключить</div>
                <div onClick={this.delete}>Удалить</div>
              </div>
          }
        </div>
      </div>
    );
  }
}

export default FoundUser;
