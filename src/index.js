import React from 'react';
import ReactDOM from 'react-dom';

import {getPlayer, calculateWinner, indexToCoords, repeat} from './game-functions.js'
import {characteristicLength} from './game-config.js';

import './index.css';

import anworldAudio from './audio/another-world-intro.mp3';
import rtypeAudio from './audio/r-type-title.mp3';
import shadowAudio from './audio/shadow-of-the-beast-intro.mp3';

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
        key={'square'+i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    let i = 0;
    let rowCounter = 0;

    // Within each row for each column render a square.
    const renderRow = () => {
      return (
        <div className="board-row" key={'row'+(rowCounter++)}>
          {repeat(characteristicLength, () => this.renderSquare(i++))}
        </div>
      );
    }

    // For each row render a row
    return (
      <div>
        {repeat(characteristicLength, renderRow)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
      super(props);

      const music = [anworldAudio, rtypeAudio, shadowAudio];
      const currentMusicIndex = Math.floor(Math.random()*Math.floor(music.length));
      const currentMusic = music[currentMusicIndex];

      const numSquares = characteristicLength * characteristicLength;

      this.state = {
        history: [{
          squares: Array(numSquares).fill(null),
          move: 'No moves'
        }],
        stepNumber: 0,
        playerOneNext: true,
        winner: null,
        music: music,
        currentMusicIndex: currentMusicIndex,
        currentMusic: currentMusic,
      }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current  = history[history.length - 1];
    const squares = current.squares.slice();

    if (this.state.winner || squares[i]) return;

    const currentPlayer = getPlayer(this.state.playerOneNext);
    squares[i] = currentPlayer;

    const [xCoord, yCoord] = indexToCoords(i, characteristicLength);

    const winner = calculateWinner(squares, characteristicLength);
    this.setState({
      history: history.concat([{
        squares: squares,
        move: currentPlayer + ' at (x:' + xCoord + ', y:' + yCoord + ')',
      }]),
      stepNumber: history.length,
      playerOneNext: !this.state.playerOneNext,
      winner: winner,
    });
  }

  jumpTo(step) {
    /* TODO: Move playerOneNext and winner into the history array,
    then we only need to set `stepNumber` here */
    this.setState({
      stepNumber: step,
      playerOneNext: (step % 2) === 0,
      winner: null
    });
  }

  handleEnded() {
    const music = this.state.music;
    let currentMusicIndex = this.state.currentMusicIndex;
    currentMusicIndex = (currentMusicIndex + 1) % music.length;

    let currentMusic = music[currentMusicIndex];


    console.log("changing music");
    this.setState({
      currentMusicIndex: currentMusicIndex,
      currentMusic: currentMusic
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
    if (this.state.stepNumber===0) {
      status = 'SHALL WE PLAY A GAME?';
    } else if (winner) {
      status = 'Winner: ' + this.state.winner;
    } else {
      status = 'Next player: ' + getPlayer(this.state.playerOneNext);
    }

    return (
      <div className="background">
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className={`status ${winner?'winner':''}`}>{status}</div>
            <ol>{moves}</ol>
          </div>
          <figure className="music">
            <figcaption>Music from <a href="https://retro.sx">retro.sx</a></figcaption>
            <audio controls src={this.state.currentMusic} preload="none" autoPlay={true} onEnded={() => this.handleEnded()}>
              <p>Your browser does not support the <code>audio</code> element.</p>
            </audio>
          </figure>
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
