import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';

export default function game_init(root) {
  ReactDOM.render(<Starter />, root);
}
const arr = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H"];
const shuffledArray = shuffle(arr);
const game_board_init = gameBoardIniter();

class Starter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //rightTry: 0,
      wrongTry: 0,
      score: 0,
      compareFirstValue: "",
      compareFirstId: [],
      game_board: Array.from(game_board_init)
      
      /*game_board: [
        {id: [0,0], value: shuffledArray[0], showAnswer: false},
        {id: [0,1], value: shuffledArray[1], showAnswer: false},
        {id: [0,2], value: shuffledArray[2], showAnswer: false},
        {id: [0,3], value: shuffledArray[3], showAnswer: false},
        {id: [1,0], value: shuffledArray[4], showAnswer: false},
        {id: [1,1], value: shuffledArray[5], showAnswer: false},
        {id: [1,2], value: shuffledArray[6], showAnswer: false},
        {id: [1,3], value: shuffledArray[7], showAnswer: false},
        {id: [2,0], value: shuffledArray[8], showAnswer: false},
        {id: [2,1], value: shuffledArray[9], showAnswer: false},
        {id: [2,2], value: shuffledArray[10], showAnswer: false},
        {id: [2,3], value: shuffledArray[11], showAnswer: false},
        {id: [3,0], value: shuffledArray[12], showAnswer: false},
        {id: [3,1], value: shuffledArray[13], showAnswer: false},
        {id: [3,2], value: shuffledArray[14], showAnswer: false},
        {id: [3,3], value: shuffledArray[15], showAnswer: false}
      ]*/
    }
  }

  /**
   * Get the element from game_board by id.
   * @param {*} i the first value in id.(id[i,j])
   * @param {*} j the second value in id.(id[i,j])
   */
  getObjectById(i, j) {
    let obj = this.state.game_board.filter(a => a.id.toString() == [i,j].toString());
    return obj;
  }

  getStateCompareFirstId() {
    return this.state.compareFirstId;
  }

  /**
   * Restart Game.
   */
  restart() {
    window.location.reload();
  }

  /**
   * Handle Click Event.
   * @param {*} i  the id [i, j] of button.
   * @param {*} j  the id [i, j] of button.
   */
  click(i , j) {
    if (this.getStateCompareFirstId().toString() == [].toString()) {
      let index = this.state.game_board.findIndex(x => x.id.toString() == [i, j].toString());
      let newBoard = this.state.game_board;
      newBoard[index].showAnswer = !newBoard[index].showAnswer;
      let state1 = _.assign({}, this.state, {game_board: newBoard}, {compareFirstId: [i,j]}, 
        {compareFirstValue: this.getObjectById(i, j)[0].value});
      
      this.setState(state1);
      //this.changeBoardShowAnswer(index);
    }
    else {
      if (this.getObjectById(i, j)[0].value == this.state.compareFirstValue) {
        let index = this.state.game_board.findIndex(x => x.id.toString() == [i, j].toString());
        let newBoard = this.state.game_board;
        newBoard[index].showAnswer = !newBoard[index].showAnswer;
        let state1 = _.assign({}, this.state, {game_board: newBoard}, {compareFirstId: []}, 
          {compareFirstValue: ""}, {score: this.state.score += Math.ceil((this.state.wrongTry > 0 ? 1/this.state.wrongTry * 10 : 10))}, 
          {wrongTry: 0});
        this.setState(state1);
        //this.changeBoardShowAnswer(index);
      }
      else {
        let index = this.state.game_board.findIndex(x => x.id.toString() == [i, j].toString());
        let formerIndex = this.state.game_board.findIndex(x => x.id.toString() == this.state.compareFirstId.toString());
        let newBoard = this.state.game_board;
        newBoard[index].showAnswer = true;
        let state1 = _.assign({}, this.state, {game_board: newBoard});
        this.setState(state1);
        setTimeout(() => this.flipBack(i, j), 1000);
      }
    }
  }

  flipBack(i, j) {
    let newBoard = this.state.game_board;
    let index = this.state.game_board.findIndex(x => x.id.toString() == [i, j].toString());
    let formerIndex = this.state.game_board.findIndex(x => x.id.toString() == this.state.compareFirstId.toString());
    newBoard[index].showAnswer = false;
    newBoard[formerIndex].showAnswer = false;
    let state2 = _.assign({}, this.state, {game_board: newBoard}, {compareFirstId: []}, 
      {compareFirstValue: ""}, {wrongTry: this.state.wrongTry + 1});
    this.setState(state2);
  }

  render() {
    /**
     * Learned from Professor's Note.
     */
    let rows = [];
    for (let ii = 0; ii < 4; ++ii) {
      let cols = [];
      var col;
      for (let jj = 0; jj < 4; ++jj) {
        if (this.getObjectById(ii, jj)[0].showAnswer == true) {
          col = <div key = {"aKey" + ii + jj} className="column1">
          <button key={ii.toString() + jj.toString()} id={"button" + ii.toString() + jj.toString()}>{this.getObjectById(ii,jj)[0].value}</button>
          </div>
        }
        else {
          col = <div key = {"aKey" + ii + jj} className="column1">
          <button key={ii.toString() + jj.toString()} id={"button" + ii.toString() + jj.toString()} onClick = {() => this.click(ii, jj)}></button>
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
        <button onClick = {() => this.restart()}>Restart</button>
        <p>Score: {this.state.score}</p>
        {rows}
      </div>
    )
  }
}

/*
  Work Cited from StakOverFlow.
*/
function shuffle(a) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() *(i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}
/*
  End
*/

function gameBoardIniter() {
  let count = 0;
  let b = [];
  for (let i = 0; i < 4; ++i) {
    for (let j = 0; j < 4; ++j) {
      b[count] = {id: [i, j], value: shuffledArray[count++], showAnswer: false};
    }
  }
  return b;
}


