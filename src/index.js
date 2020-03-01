import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Row, Col, Button } from 'antd';

import './index.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'

function Square(props) {
    return (
        <button className={"square " + props.value} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

function calculateWinner(squares) {
  // all possible winning moves
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    // If I have the same symbol in each position, then it is a winning move
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
  
  class Board extends React.Component {
    
    // function to draw a square
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
            <Col span={2}></Col>
            <Col span={20}>
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </Col>
            <Col span={2}></Col>
          </div>
          <div className="board-row">
            <Col span={2}></Col>
            <Col span={20}>
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </Col>
            <Col span={2}></Col>
          </div>
          <div className="board-row">
            <Col span={2}></Col>
            <Col span={20}>
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </Col>
            <Col span={2}></Col>
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
            // Fill all the squares with null
            squares: Array(9).fill(null),
          }],
          stepNumber: 0,
          xIsNext: true,
        };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
          return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
          history: history.concat([{
            squares: squares,
          }]),
          stepNumber: history.length,
          xIsNext: !this.state.xIsNext,
        });
      }

      // function to return to a previous move
      jumpTo(step) {
        this.setState({
          stepNumber: step,
          xIsNext: (step % 2) === 0,
        });
      }

    render() {
      const { Header, Content } = Layout;
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      // generate the list of movements
      const moves = history.map((step, move) => {
        let button;
        if (move) {
          button = <Button shape="round" onClick={() => this.jumpTo(move)}>{'Go to move #' + move}</Button>;
        } else {
          button = <Button type="primary" shape="round" onClick={() => this.jumpTo(move)}>{'Go to game start'}</Button>;
        }
        return (
          <li key={move}>
            {button}
          </li>
        );
      });

      let status;
      if (winner) {
          status = 'Winner: ' + winner;
      } else {
          status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
      return (
        <Layout className="heigth-100">
          <Header>
            <h1 className="header">My TIC-TAC-TOE</h1>
          </Header>
          <Content className="body">
          <Row className="heigth-70">
            <Col span={6}></Col>
            <Col span={12} className="heigth-100 text-center">
              <div className="game heigth-80">
                <Col span={8}>
                  <h1 className="game-info">
                    <div>{status}</div>
                  </h1>
                </Col>
                <Col span={8}>
                  <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                  </div>
                </Col>
                <Col span={8}>
                  <div className="game-info">
                    <ol>{moves}</ol>
                  </div>
                </Col>
              </div>
            </Col>
            <Col span={6}></Col>
          </Row>
          </Content>
        </Layout>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  