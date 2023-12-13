// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

const GRID_SIZE = 10;
const SHIP_TYPES = [
  { name: 'Portaaviones', size: 5 },
  { name: 'Crucero', size: 4 },
  { name: 'Submarino', size: 3 },
  { name: 'Lancha', size: 2 },
];

const App = () => {
  const generateEmptyGrid = () => {
    return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  };

  const generateRandomGrid = () => {
    const grid = generateEmptyGrid();
    SHIP_TYPES.forEach((ship) => {
      placeShipRandomly(grid, ship);
    });
    return grid;
  };

  const placeShipRandomly = (grid, ship) => {
    const startRow = Math.floor(Math.random() * GRID_SIZE);
    const startCol = Math.floor(Math.random() * (GRID_SIZE - ship.size + 1));

    for (let i = 0; i < ship.size; i++) {
      grid[startRow][startCol + i] = 1;
    }
  };

  const [playerGrid, setPlayerGrid] = useState(generateEmptyGrid());
  const [computerGrid, setComputerGrid] = useState(generateRandomGrid());
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [placingShips, setPlacingShips] = useState(true);
  const [selectedShip, setSelectedShip] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [playerShots, setPlayerShots] = useState([]);

  useEffect(() => {
    if (!placingShips && !isPlayerTurn) {
      setTimeout(() => {
        handleComputerTurn();
      }, 1000);
    }
  }, [placingShips, isPlayerTurn]);

  const renderShipButtons = () => {
    return SHIP_TYPES.map((ship) => (
      <button
        key={ship.name}
        onClick={() => selectShip(ship)}
        disabled={placedShips.includes(ship.name)}
      >
        {ship.name}
      </button>
    ));
  };

 

const handleCellClick = (row, col) => {
  if (placingShips && selectedShip && !placedShips.includes(selectedShip.name)) {
    
    const newPlayerGrid = [...playerGrid];

     // Se fija la superposicion de barccos
    if (col + selectedShip.size <= GRID_SIZE) {
      for (let i = 0; i < selectedShip.size; i++) {
      
        if (newPlayerGrid[row][col + i] !== 0) {
          alert('No puedes superponer barcos. Elige otra ubicación.');
          return;
        }
        newPlayerGrid[row][col + i] = 1;
      }

    
      setPlayerGrid(newPlayerGrid);
      setPlacedShips([...placedShips, selectedShip.name]);
    } else {
      alert('No hay suficiente espacio para colocar el barco en esta dirección.');
    }
  } else if (!placingShips && !isPlayerTurn) {
    
    const cellValue = computerGrid[row][col];

    // Verifica si la celda es un barco (1)
    if (cellValue === 1) {
      alert('¡Has dado a un barco!');
    } else {
      alert('Agua');
    }
    // Actualiza los tiros
    const newPlayerShots = [...playerShots, { row, col, result: cellValue === 1 ? 'X' : 'O' }];
    setPlayerShots(newPlayerShots);

    
    const newComputerGrid = [...computerGrid];
    newComputerGrid[row][col] = cellValue === 1 ? 'X' : 'O';
    setComputerGrid(newComputerGrid);

    
    if (!computerGrid.flat().includes(1)) {
      alert('¡Felicidades! Has ganado la partida.');
      setPlayerWins(playerWins + 1);
      resetGame();
    } else {
      setIsPlayerTurn(true);
    }
  }
};



  
  const handleComputerTurn = () => {
    const randomRow = Math.floor(Math.random() * GRID_SIZE);
    const randomCol = Math.floor(Math.random() * GRID_SIZE);

    const isCellAlreadyShot = playerGrid[randomRow][randomCol] === 'X' || playerGrid[randomRow][randomCol] === 'O';

    if (isCellAlreadyShot) {
      handleComputerTurn();
      return;
    }

    const cellValue = playerGrid[randomRow][randomCol];
    const isHit = cellValue === 1;

    alert(isHit ? '¡La computadora ha dado a tu barco!' : 'Agua para la computadora');

    const newPlayerGrid = [...playerGrid];
    newPlayerGrid[randomRow][randomCol] = isHit ? 'X' : 'O';
    setPlayerGrid(newPlayerGrid);

    if (!newPlayerGrid.flat().includes(1)) {
      alert('¡La computadora ha ganado la partida!');
      setComputerWins(computerWins + 1);
      resetGame();
    } else {
      setIsPlayerTurn(false);
    }
  };

  const resetGame = () => {
    setPlacingShips(true);
    setSelectedShip(null);
    setPlacedShips([]);
    setIsPlayerTurn(true);
    setPlayerShots([]);
    setPlayerGrid(generateEmptyGrid());
    setComputerGrid(generateRandomGrid());
  };

  const startGame = () => {
    setPlacingShips(false);
  };

  const selectShip = (ship) => {
    setSelectedShip(ship);
  };

  const renderPlayerShots = () => {
    return playerShots.map((shot) => (
      <div key={`${shot.row}-${shot.col}`} className={`cell ${shot.result}`}>
        {shot.result === 'X' ? 'X' : 'O'}
      </div>
    ));
  };

  return (
    <div className="app">
      <h1>BATALLA NAVAL</h1>
      <div className="board-container">
        <div className="board">
          <h2>Jugador 1</h2>
          {playerGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${cell === 1 ? 'occupied' : ''}`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell === 'X' && 'X'}
                </div>
              ))}
            </div>
          ))}
          {placingShips && renderShipButtons()}
          {!placingShips && (
            <button onClick={startGame}>Comenzar Partida</button>
          )}
        </div>

        <div className="board">
          <h2>Computadora</h2>
          {computerGrid.map((row, rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map((cell, colIndex) => (
                <div key={colIndex} className={`cell ${cell === 1 ? 'occupied' : ''}`} />
              ))}
            </div>
          ))}
          {!isPlayerTurn && renderPlayerShots()}
        </div>
      </div>

      <div className="scoreboard">
        <p>Partidas ganadas:</p>
        <p>Jugador 1: {playerWins}</p>
        <p>Computadora: {computerWins}</p>
      </div>
    </div>
  );
};

export default App;
