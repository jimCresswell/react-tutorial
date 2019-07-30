import React from 'react';
import ReactDOM from 'react-dom';

import {getPlayer, calculateWinner, indexToCoords} from './pure-functions.js'

import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
          move: 'No moves'
        }],
        stepNumber: 0,
        xIsNext: true,
        winner: null,
      }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current  = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.winner || squares[i]) return;

    const currentPlayer = getPlayer(this.state.xIsNext);
    squares[i] = currentPlayer;

    const [xCoord, yCoord] = indexToCoords(i);

    const winner = calculateWinner(squares);
    this.setState({
      history: history.concat([{
        squares: squares,
        move: currentPlayer + ' at (x:' + xCoord + ', y:' + yCoord + ')',
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      winner: winner,
    });
  }

  jumpTo(step) {
    /* TODO: Move xIsNext and winner into the history array,
    then we only need to set `stepNumber` here */
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      winner: null
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.state.winner;

    const moves = history.map((step, moveNumber) => {

      const desc = moveNumber > 0 ? 'Go to move #' + moveNumber + '. ' + step.move : 'Go to game start';
      return (
        <li key={moveNumber} className={moveNumber===this.state.stepNumber?'highlight':''}>
          <button onClick={() => this.jumpTo(moveNumber)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + getPlayer(this.state.xIsNext);
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
