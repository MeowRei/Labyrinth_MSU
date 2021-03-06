import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  CHANGECOMP,
  DELETEACTION,
  expField,
  KEYBOARDACTION,
  MOUSEACTION,
  MOVEDOWN,
  MOVELEFT,
  MOVERIGHT,
  MOVEUP,
  NEWVALUE,
  saveExp,
  STARTPOS,
} from '../../store/creators/creators';
import '../Field/Field.css';
import StatusButtons from '../StatusButtons/StatusButtons';
import Keyboard from '../Keyboard/Keyboard';
import './Experiment.css';

const initialState = {
  expName: '',
  expNumber: 1,
  expAnimal: '',
  expType: '',
  timer: 0,
  wall: false,
  food: false,
  fakeFood: false,
  entry: false,
  exit: false,
  pedal: false,
  changeStatus: false,
  startPosition: false,
  moveStatus: false,
  expBegin: false,
  loading: false,
  error: false,
  response: null,
  type: null,
  description: null,
  click: '',
  clickCounter: 0,
  feeding: 0,
};

class Experiment extends Component {
  constructor(props) {
    super(props);

    this.state = {...initialState};
  }

  componentDidMount = async () => {
    this.props.fullField(this.props.match.params.id);
    this.setState({response: null});
    let resp = await fetch('/types', {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    });
    const res = await resp.json();
    this.setState({loading: true});
    if (res.response) {
      this.setState({loading: false, error: false, response: res.response});
    } else {
      this.setState({loading: false, error: true});
    }
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  changeValue = (prevValue) => {
    const getValue = (e) => {

      const x = e.key;
      const regex = /[\u0400-\u04FF0-9]+/g;
      const match = regex.exec(x);
      if (x === 'Backspace') {
        this.props.newValue(prevValue, null);
      } else if (match) {
        this.props.newValue(prevValue, x);
        this.setState({changeStatus: !this.state.changeStatus});
      }
    };
    document.onkeydown = getValue;
  };

  newExpNumber = (e) => {
    this.setState({expNumber: e.target.value});
  };

  newExpAnimal = (e) => {
    this.setState({expAnimal: e.target.value});
  };

  expType = (e) => {
    this.setState({expType: e.target.value});
  };

  action = (e) => {
    switch (true) {
      case this.state.wall:
        this.props.newComp(e.target.id, 'wall');
        break;
      case this.state.food:
        this.props.newComp(e.target.id, 'food');
        break;
      case this.state.fakeFood:
        this.props.newComp(e.target.id, 'fakeFood');
        break;
      case this.state.entry:
        this.props.newComp(e.target.id, 'entry');
        break;
      case this.state.exit:
        this.props.newComp(e.target.id, 'exit');
        break;
      case this.state.pedal:
        this.props.newComp(e.target.id, 'pedal');
        break;
      case this.state.startPosition:
        this.props.startPos(e.target.id);
        break;
      default:
        this.changeValue(e.target.id);
        break;
    }
    this.setState({changeStatus: !this.state.changeStatus});
  };

  cellStatusExp = (e) => {
    let translate;
    switch (e.target.innerText) {
      case 'стена':
        translate = 'wall';
        break;
      case 'кормушка':
        translate = 'food';
        break;
      case 'ложная кормушка':
        translate = 'fakeFood';
        break;
      case 'вход':
        translate = 'entry';
        break;
      case 'выход':
        translate = 'exit';
        break;
      case 'педаль':
        translate = 'pedal';
        break;
      case 'Стартовая позиция':
        translate = 'startPosition';
        break;
    }

    const currentState = this.state;

    for (let key in currentState) {
      switch (key) {
        case translate:
          currentState[key] = !currentState[key];
          break;
        case 'wall':
          currentState[key] = false;
          break;
        case 'food':
          currentState[key] = false;
          break;
        case 'fakeFood':
          currentState[key] = false;
          break;
        case 'entry':
          currentState[key] = false;
          break;
        case 'exit':
          currentState[key] = false;
          break;
        case 'pedal':
          currentState[key] = false;
          break;
        case 'startPosition':
          if (this.state.expBegin) {
            currentState[key] = currentState[key];
          } else {
            currentState[key] = false;
          }
          break;
      }
    }
    this.setState(currentState);
  };

  timer() {
    this.setState({
      timer: this.state.timer + 1,
    });
    if (!this.state.expBegin) {
      clearInterval(this.intervalId);
    }
  }

  startExp = () => {
    let keyButton = this.props.keyboard;
    this.setState({expBegin: true});
    this.intervalId = setInterval(this.timer.bind(this), 1000);
    let clickCount = 0;
    const move = (e) => {
      let timer = this.state.timer;

      let singleClick = (value) => {
        keyButton(value, timer);
        if (value === '+') {
          this.setState({feeding: this.state.feeding + 1});
        }
      };

      let doubleClick = (value) => {
        keyButton(value, timer);
      };

      const x = e.code;
      if (this.state.expBegin) {
        switch (x) {
          case 'ArrowUp':
            e.preventDefault();
            this.props.moveUp(this.state.timer);
            this.setState({expStatus: !this.state.moveStatus});
            break;
          case 'ArrowDown':
            e.preventDefault();
            this.props.moveDown(this.state.timer);
            this.setState({expStatus: !this.state.moveStatus});
            break;
          case 'ArrowRight':
            e.preventDefault();
            this.props.moveRight(this.state.timer);
            this.setState({expStatus: !this.state.moveStatus});
            break;
          case 'ArrowLeft':
            e.preventDefault();
            this.props.moveLeft(this.state.timer);
            this.setState({expStatus: !this.state.moveStatus});
            break;
          case 'Numpad1':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('e');

              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('x');
            }
            break;
          case 'Numpad2':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('w');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('z');
            }
            break;
          case 'Numpad3':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('r');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('m');
            }
            break;
          case 'Numpad4':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('j');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('q');
            }
            break;
          case 'Numpad5':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('|');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('b');
            }
            break;
          case 'Numpad6':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('s');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('l');
            }
            break;
          case 'Numpad7':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('t');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('?');
            }
            break;
          case 'Numpad8':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('h');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('_');
            }
            break;
          case 'Numpad9':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('o');
              }, 300);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('i');
            }
            break;
          case 'Backspace':
            e.preventDefault();
            this.props.deleteAction();
            this.setState({expStatus: !this.state.moveStatus});

            break;
          case 'NumpadDivide':
            e.preventDefault();
            singleClick('/');
            break;
          case 'NumpadMultiply':
            e.preventDefault();
            singleClick('*');
            break;
          case 'NumpadSubtract':
            e.preventDefault();
            singleClick('-');
            break;
          case 'NumpadAdd':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('+');
              }, 400);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('a');
            }
            break;
          case 'Numpad0':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('y');
              }, 400);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('d');
            }
            break;
          case 'NumpadDecimal':
            e.preventDefault();
            clickCount++;
            if (clickCount === 1) {
              this.singleClickTimer = setTimeout(function() {
                clickCount = 0;
                singleClick('k');
              }, 400);
            } else if (clickCount === 2) {
              clearTimeout(this.singleClickTimer);
              clickCount = 0;
              doubleClick('g');
            }
            break;
        }
      }
    };
    document.onkeydown = move;
  };

  finishExp = () => {
    clearInterval(this.intervalId);
    this.setState({expBegin: false});
    this.props.saveExperiment(this.props.match.params.id,
        this.state.expName,
        this.props.expField.moves,
        this.props.expField.name,
        this.state.expNumber,
        this.state.expAnimal,
        this.state.type,
        this.state.feeding);
    this.setState({...initialState});
    this.redirectNewExp();
  };

  redirectNewExp = async () => {
    const response = await fetch(
        '/getNewExpField',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.match.params.id,
            env: this.props.expField.name,
          }),
        },
    );
    const result = await response.json();
    if (result.id) {
      this.props.history.push(`/experiment/${result.id}`);
      this.props.fullField(result.id);
    }
  };

  newExpName = (e) => {
    this.setState({expName: e.target.value});
  };

  setType = (e) => {
    this.setState({type: e.target.value});
    this.setState({
      description: e.target.options[e.target.selectedIndex].getAttribute(
          'description'),
    });
  };

  mouseClickCount = 0;
  clickAction = (e) => {
    let singleValue;
    let doubleValue;
    if (e.target.className === 'keyBtn' || e.target.className ===
        'keyWideBtn' || e.target.className === 'keyLongBtn') {
      singleValue = e.target.firstElementChild.innerText;
      doubleValue = e.target.lastElementChild.innerText;
    } else if (e.target.className === 'left') {
      singleValue = e.target.innerText;
      doubleValue = e.target.nextElementSibling.innerText;
    } else if (e.target.className === 'right') {
      singleValue = e.target.previousElementSibling.innerText;
      doubleValue = e.target.innerText;
    } else if (e.target.className === 'keyBtnTop') {
      singleValue = e.target.innerText;
      doubleValue = e.target.innerText;
    }

    let singleClick = () => {
      this.props.mouseAction(singleValue, this.state.timer);
      if (singleValue === '+') {
        this.setState({feeding: this.state.feeding + 1});
      }
    };

    let doubleClick = () => {
      this.props.mouseAction(doubleValue, this.state.timer);
    };

    this.mouseClickCount++;
    if (this.state.expBegin) {
      if (this.mouseClickCount === 1) {
        this.singleMouseClickTimer = setTimeout(() => {
          this.mouseClickCount = 0;
          singleClick();
        }, 400);
      } else if (this.mouseClickCount === 2) {
        clearTimeout(this.singleMouseClickTimer);
        this.mouseClickCount = 0;
        doubleClick();
      }
    }

  };

  endExp = async () => {
    const response = await fetch(
        '/endExp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.props.match.params.id,
          }),
        },
    );
    const result = await response.json();
    if (result.answer === 'deleted') {
      this.props.history.push('/')
    }
  };

  render() {
    return (
        <div className='board unselectable'>
          <div className={'expInputBox'}>
            <div className={'expInputs'}>
              {this.state.click && <div>{this.state.click}</div>}
              <div className={'expInputTitle'}>Название
                среды: {this.props.expField.name}</div>
              <div className={'expInputTitle'}>
                Тип эксперимента:
                {this.state.response ?
                    <select className={'expSelector'}
                            onChange={this.setType}>
                      <option/>
                      {this.state.response.map((result, index) =>
                          <option key={index}
                                  description={result.description}>{result.name}</option>,
                      )}
                    </select>
                    : null}
              </div>
              <div className={'expInputTitle'}>Название эксперимента:<input
                  className={'expInput'}
                  value={this.state.expName}
                  onChange={this.newExpName}
                  placeholder={'Введите название'}/></div>
              <div className={'expInputTitle'}>Номер опыта:<input
                  value={this.state.expNumber}
                  onChange={this.newExpNumber} className={'expInput'}
                  placeholder={'Введите номер'}/></div>
              <div className={'expInputTitle'}>Имя особи:<input
                  value={this.state.expAnimal}
                  onChange={this.newExpAnimal} className={'expInput'}
                  placeholder={'Введите имя'}/></div>
            </div>
            <div className={'expTypeDescription'}>{this.state.description}</div>

          </div>
          {this.state.expBegin ? <div className={'expProgress'}>Эксперимент в
            процессе</div> : <div className={'expProgress'}></div>}
          <div className={'expMainBox'}>
            <div>
              {this.props.expField.field &&
              this.props.expField.field.line.map((element, i) => {
                return (
                    <div key={`${element} ${i}`}>{element.line.map(
                        component => {
                          let action;
                          switch (true) {
                            case component.start:
                              action = 'start comp';
                              break;
                            case component.wall:
                              action = 'wall comp';
                              break;
                            case component.food:
                              action = 'food comp';
                              break;
                            case component.fakeFood:
                              action = 'fakeFood comp';
                              break;
                            case component.entry:
                              action = 'entry comp';
                              break;
                            case component.exit:
                              action = 'exit comp';
                              break;
                            case component.pedal:
                              action = 'pedal comp';
                              break;
                            default:
                              action = 'comp';
                              break;
                          }
                          return (
                              <span key={component.index}
                                    id={component.index}
                                    className={action}
                                    onClick={this.action}
                              >
                        {component.value
                            ?
                            <span
                                className={'ValueBtn'}>{component.value}</span>
                            :
                            component.index}
                      </span>
                          );
                        })}
                    </div>
                );
              })}
            </div>

            <div>
              <div>
                <div className={'expTimer'}>
                  <div>Таймер:</div>
                  <div className={'expTimerInt'}>{this.state.timer}</div>
                  <div>сек.</div>
                </div>
                <div className={'expTimer'}>Подкреплений: <div
                    className={'expTimerInt'}>{this.state.feeding}</div></div>
              </div>
              <Keyboard click={this.clickAction}/>
              <div className={'expStatusBtnsContainer'}>
                <StatusButtons class={'expStatusBtnsBox'}
                               btnClass={'expButton'} wall={this.state.wall}
                               food={this.state.food}
                               fakeFood={this.state.fakeFood}
                               entry={this.state.entry} exit={this.state.exit}
                               pedal={this.state.pedal}
                               cellStatus={this.cellStatusExp}/>
              </div>
              <div className={'startBtnsRow'}>
                <div>
                  <button className={'expStartButton'}
                          onClick={this.cellStatusExp}>Стартовая позиция
                  </button>
                </div>
                <div>
                  {this.state.expBegin ?
                      <button className={'expStartButton'}
                              onClick={this.finishExp}>Завершить
                        эксперимент</button> :
                      <button className={'expStartButton'}
                              onClick={this.startExp}>Начать
                        эксперимент</button>}
                </div>
              </div>
            </div>
          </div>
          <div className={'expResultInput'}>{this.props.expField.moves &&
          this.props.expField.moves.map((element, i) => {
            for (let key in element) {
              return <span key={i}>{element[key]}</span>;
            }
          })}</div>
          <button className={'exitBtn'} onClick={this.endExp}>Выйти из эксперимента</button>
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    expField: state.expField.expField,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fullField: (id) => {
      dispatch(expField(id));
    },
    newComp: (index, newComp) => {
      dispatch(CHANGECOMP(index, newComp));
    },
    newValue: (value, newValue) => {
      dispatch(NEWVALUE(value, newValue));
    },
    startPos: (index) => {
      dispatch(STARTPOS(index));
    },
    moveUp: (timer) => {
      dispatch(MOVEUP(timer));
    },
    moveDown: (timer) => {
      dispatch(MOVEDOWN(timer));
    },
    moveRight: (timer) => {
      dispatch(MOVERIGHT(timer));
    },
    moveLeft: (timer) => {
      dispatch(MOVELEFT(timer));
    },
    saveExperiment: (
        id, expName, moves, envName, expNumber, expAnimal, expType,
        expFeeding) => {
      dispatch(
          saveExp(id, expName, moves, envName, expNumber, expAnimal, expType,
              expFeeding));
    },
    keyboard: (value, time) => {
      dispatch(KEYBOARDACTION(value, time));
    },
    deleteAction: () => {
      dispatch(DELETEACTION());
    },
    mouseAction: (value, time) => {
      dispatch(MOUSEACTION(value, time));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Experiment);
