'use client'

import { useState, useEffect } from 'react';

export function useGameData() {
    const [gameData, setGameData] = useState({ size: 0, lowBetChips: 0, topBetChips: 0, totalRounds: 0, gameId: '' });

    useEffect(() => {
        const storedGameData = localStorage.getItem('gameData');

        if (storedGameData) {
            setGameData(prevGameData => ({ ...prevGameData, ...JSON.parse(storedGameData) }));
            console.log('Game data loaded from local storage 2', JSON.parse(storedGameData));
        }
    }, []);

    useEffect(() => {
        if (!gameData.size == 0) {
            localStorage.setItem('gameData', JSON.stringify(gameData));
            console.log('Game data saved to local storage 1', gameData);
        }

        setGameData(prevGameData => prevGameData);
    }, [gameData]); 

    return {
        gameData,
        setGameData,
    };
}
