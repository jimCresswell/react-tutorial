import React from 'react';
import ReactDOM from 'react-dom';

import {getPlayer, calculateWinner, indexToCoords, repeat, randIndex} from './game-functions.js'
import {characteristicLength} from './game-config.js';
import {wopr} from './ai.js';

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
      const currentMusicIndex = randIndex(music.length);
      const currentMusic = music[currentMusicIndex];

      const numSquares = characteristicLength * characteristicLength;

      // Synchronous state outside of components, that's got to be an antipattern.
      this.gameLock=false;

      this.state = {
        history: [{
          squares: Array(numSquares).fill(null),
          move: 'No moves'
        }],
        stepNumber: 0,
        playerOneNext: true,
        isDraw: false,
        winner: null,
        winningLine: null,
        music: music,
        currentMusicIndex: currentMusicIndex,
        currentMusic: currentMusic,
      }
  }

  haveAGo(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current  = history[history.length - 1];
    const squares = current.squares.slice();

    // If there is a winner or the square is not empty no action is needed.
    if (this.state.winner || squares[i]) return;

    const currentPlayer = getPlayer(this.state.playerOneNext);
    squares[i] = currentPlayer;

    const [xCoord, yCoord] = indexToCoords(i, characteristicLength);

    const winningState = calculateWinner(squares, characteristicLength);
    const winner = winningState.winner;
    const winningLine = winningState.winningLine;

    // If there is no winner and there are no empty squares it is a draw.
    const isDraw = (winner===null) && !squares.includes(null);

    this.setState({
      history: history.concat([{
        squares: squares,
        move: currentPlayer + ' at (x:' + xCoord + ', y:' + yCoord + ')',
      }]),
      stepNumber: history.length,
      playerOneNext: !this.state.playerOneNext,
      isDraw: isDraw,
      winner: winner,
      winningLine: winningLine,
    });
  }

  // This function advances the game logic.
  handleClick(i) {

    // The game board UI needs to be disabled until human and computer goes
    // are finished otherwise a fast clicker can have the computer's go.
    if (this.gameLock) return;
    this.gameLock = true;

    // Have the human go.
    this.haveAGo(i);

    // setState can be asynch. Can pass callbacks to setState.
    // Need to research React specific patterns for handling the next
    // action (state change) being dependent on the previous state.
    // For now force a render cycle to complete state update.
    // https://reactjs.org/docs/react-component.html#forceUpdate
    this.forceUpdate(() => {
      // Have the computer go.
      // Assume computer is player two.
      const history = this.state.history.slice(0, this.state.stepNumber+1);
      const current  = history[history.length - 1];
      const squares = current.squares.slice();
      const playerOne = getPlayer(true);
      const playerTwo = getPlayer(false);

      const computerSquareChoice = wopr(squares, playerTwo, playerOne);

      // Make it seem like the computer is thinking...
      const delay = 300 + Math.floor(Math.random()*500);
      setTimeout(() => {
        this.haveAGo(computerSquareChoice);

        // Re-enable the board UI.
        this.gameLock=false;
      }, delay);
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
    const isDraw = this.state.isDraw;

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
    } else if (isDraw) {
      status = 'It\'s a tie. How about a nice game of chess?'
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
