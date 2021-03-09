import React from 'react'

import { Leaderboard } from 'react-ranking-animation'
import 'react-ranking-animation/dist/index.css'

import './Table.css';

class Table extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      contestants: [],
      contestantInput: '',
      rounds: 0,
      roundsInput: 0,
      table: [] // Table does not include column headers
    };
  }

  handleContestantSubmit (event) {
    event.preventDefault();
    if (
      this.state.contestantInput === '' ||
      this.state.contestantInput === null ||
      this.state.contestantInput === undefined
    ) {
      return;
    }
    const contestants = this.state.contestants.slice();
    const unique =
      contestants.filter(
        (contestant) => contestant.name === this.state.contestantInput
      ).length === 0;
    if (!unique) {
      return;
    }
    contestants.push({ name: this.state.contestantInput, score: 0 });
    this.setState({ contestants: contestants });
    const tableCopy = this.state.table.slice();
    const rows = new Array(this.state.rounds).fill(0);
    tableCopy.push(rows);
    this.setState({ table: tableCopy });
  }

  handleRoundsSubmit (event) {
    event.preventDefault();
    if (
      this.state.roundsInput === '' ||
      this.state.roundsInput === null ||
      this.state.roundsInput === undefined
    ) {
      return;
    }
    const roundsInput = parseInt(this.state.roundsInput);
    const tableCopy = this.state.table.slice();
    if (roundsInput > this.state.rounds) {
      for (let i = 0; i < tableCopy.length; i++) {
        for (let j = this.state.rounds; j < roundsInput; j++) {
          tableCopy[i].push(0);
        }
      }
    } else if (roundsInput < this.state.rounds) {
      for (let i = 0; i < tableCopy.length; i++) {
        tableCopy[i] = tableCopy[i].slice(0, roundsInput);
      }
    } else {
      return;
    }
    this.setState({ rounds: roundsInput });
    this.setState({ table: tableCopy });
  }

  handleCellChange (row, column, event) {
    const tableCopy = this.state.table.slice();
    tableCopy[column][row] = parseInt(event.target.innerText);
    this.setState({ table: tableCopy });
  }

  handleUpdateScores () {
    const contestants = this.state.contestants.slice();
    for (let col = 0; col < this.state.table.length; col++) {
      contestants[col].score = this.state.table[col].reduce((acc, currentValue) => acc + currentValue);
    }
    this.setState({ contestants: contestants });
  }

  render () {
    const tableHeaders = this.state.contestants.map((contestant) => (
      <th key={contestant.name}>{contestant.name}</th>
    ));
    const rows = [];
    for (let i = 0; i < this.state.rounds; i++) {
      rows.push(
        <tr key={i}>
          {[...Array(tableHeaders.length)].map((x, idx) => (
            <td
              contentEditable="true"
              key={idx}
              onInput={(event) => this.handleCellChange(i, idx, event)}
            ></td>
          ))}
        </tr>
      );
    }

    return (
      <div>
        <Leaderboard contestants={this.state.contestants}></Leaderboard>
        <form
          className="input"
          onSubmit={(event) => this.handleContestantSubmit(event)}
        >
          <label htmlFor="contestant-input">Add contestant </label>
          <input
            type="text"
            id="contestant-input"
            onChange={(event) =>
              this.setState({ contestantInput: event.target.value })
            }
          ></input>
          <input type="submit" id="contestant-submit" value="Add"></input>
        </form>
        <form
          className="input"
          onSubmit={(event) => this.handleRoundsSubmit(event)}
        >
          <label htmlFor="rounds">Rounds </label>
          <input
            type="text"
            id="rounds"
            onChange={(event) =>
              this.setState({ roundsInput: event.target.value })
            }
          ></input>
          <input type="submit" id="contestant-submit" value="Enter"></input>
        </form>
        <div className="table-container">
          <table>
            <thead>
              <tr>{tableHeaders}</tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
          <button
            type="button"
            className={this.state.table.length > 0 ? 'display-visible' : 'display-none'}
            onClick={() => this.handleUpdateScores()}>Update</button>
        </div>
      </div>
    );
  }
}

export default Table;
