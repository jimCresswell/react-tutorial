import React from 'react';
import ReactDOM from 'react-dom';

import {getPlayer, calculateWinner, indexToCoords, repeat, randIndex} from './game-functions.js'
import {
  characteristicLength,
  initialDifficulty,
  difficultyOptions,
  startMessage as initialStartMessage
} from './game-config.js';
import {wopr} from './ai.js';

import './index.css';

import anworldAudio from './audio/another-world-intro.mp3';
import rtypeAudio from './audio/r-type-title.mp3';
import shadowAudio from './audio/shadow-of-the-beast-intro.mp3';

// The game board squares.
function Square(props) {
  const classNames = `square ${props.shouldHighlight ? 'highlight' : ''} ${props.isOnWinningLine ? 'winner':''}`;
  return (
    <button className={classNames} onClick={props.onClick} onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>
      <span role="img" aria-label="player character">{props.playerCharacter}</span>
    </button>
  );
}

// The game board.
class Board extends React.Component {
  renderSquare(i) {
    const winningLine = this.props.winningLine;
    const isOnWinningLine = winningLine!==null && winningLine.includes(i);
    const shouldHighlight = this.props.highlight === i;

    return (
      <Square
        key={'square'+i}
        playerCharacter={this.props.squares[i]}
        isOnWinningLine={isOnWinningLine}
        shouldHighlight={shouldHighlight}
        onMouseOver = {() => this.props.onMouseOver(i)}
        onMouseOut = {() => this.props.onMouseOut(i)}
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

// The top level Game object that holds state and controls rendering.
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
          indexPlayed: null,
          move: 'No moves'
        }],
        startMessage: [],
        stepNumber: 0,
        playerOneNext: true,
        isDraw: false,
        winner: null,
        winningLine: null,
        music: music,
        currentMusicIndex: currentMusicIndex,
        currentMusic: currentMusic,
        difficulty: initialDifficulty,
        difficultyOptions: difficultyOptions
      }
  }

  haveAGo(i) {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current  = history[history.length - 1];
    const squares = current.squares.slice();

    // If there is a winner or draw or the square is not empty no action is needed.
    if (this.state.winner || this.state.isDraw || squares[i]) return;

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
        indexPlayed: i,
        move: currentPlayer + ' at (x:' + xCoord + ', y:' + yCoord + ')',
      }]),
      stepNumber: history.length,
      playerOneNext: !this.state.playerOneNext,
      isDraw: isDraw,
      winner: winner,
      winningLine: winningLine,
      highlight: null,
      reverseHistory: false
    });
  }

  // Record which elements are being hovered over in the game state.
  handleMouseOver(i) {
    this.setState({highlight: i});
  }
  handleMouseOut(i) {
    this.setState({highlight: null});
  }

  // This function advances the game logic.
  handleBoardClick(i) {

    // The game board UI needs to be disabled until human and computer goes
    // are finished otherwise a fast clicker can have the computer's go.
    if (this.gameLock) return;
    this.gameLock = true;

    // Have the human go.
    this.haveAGo(i);

    // If the second player is human don't invoke AI.
    if(this.state.difficulty === 'human') {
        this.gameLock=false;
        return;
    }

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
      const computerCharacter = getPlayer(this.state.playerOneNext);
      const humanCharacter = getPlayer(!this.state.playerOneNext);
      const difficulty = this.state.difficulty;

      const computerSquareChoice = wopr(difficulty, squares, computerCharacter, humanCharacter);

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
    /* TODO: Move all changeable state except stepNumber into the history array,
    then we only need to set `stepNumber` here */
    this.setState({
      stepNumber: step,
      playerOneNext: (step % 2) === 0,
      winner: null,
      isDraw: false,
      winningLine: null,
    });
  }

  reverseHistory() {
    this.setState({
      reverseHistory: !this.state.reverseHistory
    });
  }

  handleEnded() {
    const music = this.state.music;
    let currentMusicIndex = this.state.currentMusicIndex;
    currentMusicIndex = (currentMusicIndex + 1) % music.length;

    let currentMusic = music[currentMusicIndex];

    this.setState({
      currentMusicIndex: currentMusicIndex,
      currentMusic: currentMusic
    });
  }

  handleDifficultyChange(e) {
    const newDifficulty = e.target.value;
    this.setState({
      difficulty: newDifficulty
    });
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[this.state.stepNumber];
    const winner = this.state.winner;
    const isDraw = this.state.isDraw;
    const winningLine = this.state.winningLine;
    const highlight = this.state.highlight;
    const reverseHistory = this.state.reverseHistory;
    const startMessage = this.state.startMessage.slice();
    const difficulty = this.state.difficulty;
    const difficultyOptions = this.state.difficultyOptions.slice();

    const moveListItems = history.map((step, moveNumber) => {
      const desc = moveNumber > 0 ? 'Go to move #' + moveNumber + '. ' + step.move : 'Go to game start';
      const isCurrent = moveNumber===stepNumber;
      const shouldHighlight = highlight!==null && highlight===step.indexPlayed;
      const currentClass = `${isCurrent ? 'current' : ''}`;
      const highlightClass = `${shouldHighlight ? 'highlight' : ''}`;
      return (
        <li key={moveNumber} className={currentClass}>
          <button
            className={highlightClass}
            onClick={() => this.jumpTo(moveNumber)}
            onMouseOver={() => this.handleMouseOver(step.indexPlayed)}
            onMouseOut={() => this.handleMouseOut(step.indexPlayed)}
            >{desc}</button>
        </li>
      );
    });

    const difficultyOptionEls = difficultyOptions.map((option) => {
      return (
        <option key={option} value={option}>{option}</option>
      );
    });

    let status;
    // At game start, loop over the contents of the start message by repeatedly
    // setting state in a timeout causing render to be called.
    // Creates typing effect.
    if (this.state.stepNumber===0) {
      // Set message with blinking cursor every other iteration.
      status = startMessage.concat(initialStartMessage.length%2===1 ? '_' : '');
      if(initialStartMessage.length) {
        let letter = initialStartMessage.shift();
        setTimeout(() => {
          let currentMessage = startMessage.concat(letter);
          // This causes the rerender and so loop.
          this.setState({
            startMessage: currentMessage
          })
        }, 130);
      }
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
              winningLine = {winningLine}
              highlight = {highlight}
              onClick={(i) => this.handleBoardClick(i)}
              onMouseOver={(i) => this.handleMouseOver(i)}
              onMouseOut={(i) => this.handleMouseOut(i)}
            />
          </div>
          <div className="game-info">
            <div className={`status ${winner?'winner':''}`}>{status}</div>
            <button className="reverse-history" onClick={() => this.reverseHistory()}><span role="img" aria-label="reverse list order">🔃</span></button>
            <ol className="history">{reverseHistory ? moveListItems.reverse() : moveListItems}</ol>
          </div>
          <figure className="controls">
            <figcaption>Music from <a href="https://retro.sx">retro.sx</a></figcaption>
            <audio controls src={this.state.currentMusic} preload="none" autoPlay={true} onEnded={() => this.handleEnded()}>
              <p>Your browser does not support the <code>audio</code> element.</p>
            </audio>
            <div className="difficulty">
              <label>Difficulty: <select value={difficulty} onChange={(e) => this.handleDifficultyChange(e)}>{difficultyOptionEls}</select></label>
            </div>
            <div className="source-link"><a href="https://github.com/jimCresswell/triple-t">Source code available here.</a></div>
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
