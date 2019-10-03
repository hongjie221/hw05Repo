import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root, channel) {
  ReactDOM.render(<Starter channel={channel} />, root);
}


class Starter extends React.Component {
  constructor(props) {
    super(props);

    this.channel = props.channel;

    this.state = {
      wrongTry: 0,
      score: 0,
      compareFirstValue: "",
      compareFirstId: [],
      game_board:[],
    };
    
    this.channel
        .join()
        .receive("ok", this.got_view.bind(this))
        .receive("error", resp => {console.log("Unable to join", resp);});
  }

  got_view(view) {
    this.setState(view.game);
  }

  getObjectByIdShowAnswer(i, j) {
    if (this.state.game_board.length == 0) {
      return false;
    }
    else {
      let obj = this.state.game_board.filter(a => a.id.toString() == [i, j].toString());
      return obj[0].showAnswer;
    } 
  }

  getObjectByIdGetValue(i, j) {
    if (this.state.game_board.length == 0) {
      return "";
    }
    else {
      let obj = this.state.game_board.filter(a => a.id.toString() == [i, j].toString());
      return obj[0].value;
    }
  }

  click(id) {
    this.channel.push("click", {letter: id})
        .receive("ok", this.got_view.bind(this));
    window.setTimeout(() => this.flipBack(id), 1000);
    
  }

  flipBack(id) {
    if(this.state.compareFirstId.toString() != id.toString() && this.state.compareFirstId.length != 0) {
        this.channel.push("flipBack", {args: id})
            .receive("ok", this.got_view.bind(this));
    }
  }

  restart() {
    let i = 0;
    this.channel.push("restart", {para: i})
            .receive("ok", this.got_view.bind(this));
  }
  
  render() { 
    let rows = [];
    for (let ii = 0; ii < 4; ++ii) {
      let cols = [];
      var col;
      for (let jj = 0; jj < 4; ++jj) {
        if (this.getObjectByIdShowAnswer(ii, jj) == true) {
          col = <div key = {"aKey" + ii + jj} className="column1">
          <button key={ii.toString() + jj.toString()} 
              id={"button" + ii.toString() + jj.toString()}>
              {this.getObjectByIdGetValue(ii, jj)}
          </button>
          </div>
        }
        else {
          col = <div key = {"aKey" + ii + jj} className="column1">
          <button key={ii.toString() + jj.toString()} 
              id={"button" + ii.toString() + jj.toString()} 
              onClick = {() => this.click([ii, jj])}>
          </button>
          </div>
        }
        cols.push(col);
      }
      rows.push(
        <div key = {"bKey" + ii} className="row">
          {cols}
        </div>
      )
    }
    return (
      <div key="moreRandom">
        <p><button onClick = {() =>  this.restart()}>Restart</button></p>
        <p>score: {parseInt(this.state.score)}</p>
        {rows}
      </div>
    )
  }
  

}