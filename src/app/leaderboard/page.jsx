// pages/leaderboard.js

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5005');

const Leaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState([]);

    useEffect(() => {
        // Set up Socket.IO event listener
        socket.on('leaderboardUpdate', handleLeaderboardUpdate);

        // Clean up the event listener when the component unmounts
        return () => {
            socket.off('leaderboardUpdate', handleLeaderboardUpdate);
        };
    }, []);

    const handleLeaderboardUpdate = (data) => {
        setLeaderboardData(data);
    };

    return (
        <div className="bg-gradient-to-r from-green-400 to-blue-500 min-h-screen flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-4xl">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Mina Poker Leaderboard
                </h1>
                <div className="overflow-x-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="bg-gray-800 text-white">
                                <th className="px-4 py-2">Rank</th>
                                <th className="px-4 py-2">Player</th>
                                <th className="px-4 py-2">Winnings</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboardData.map((entry, index) => (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                                        } hover:bg-gray-200 transition-colors duration-300`}
                                >
                                    <td className="px-4 py-2 text-gray-800 font-medium">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-2 text-gray-800">{entry.player}</td>
                                    <td className="px-4 py-2 text-gray-800">
                                        {entry.winnings} $MPC
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;