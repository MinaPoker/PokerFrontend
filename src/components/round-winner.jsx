import useSWR from 'swr';
import stateFetcher from '@/fetcher/state';
import { useState, useEffect } from 'react';
import Player from './player';
import classNames from 'classnames';

export default function RoundWinner() {
  const { data: gamePlayersCard } = useSWR('local:gamePlayersCard', stateFetcher);
  const { data: roundWinner, mutate: roundWinnerMutate } = useSWR('local:roundWinner', stateFetcher);
  const { data: gameUsers } = useSWR('local:gameUsers', stateFetcher);

  useEffect(() => {
    if (roundWinner) {
      setTimeout(() => {
        stateFetcher('local:roundWinner', null).then(roundWinnerMutate);
      }, roundWinner?.animationSecond || 6000); 
    }
  }, [roundWinner]);

  const winner = gameUsers?.find(u => u.userId === roundWinner?.userId);

  return (
    <div className={classNames(
      'round-winner-container', 
      winner ? 'visible' : 'hidden' 
    )}>
      {roundWinner && <Player
        style={{ left: 360, top: 330 }} 
        showAuto={false} 
        showBitChips={false}
        user={winner}
        isCurrentPlayer={true}
        cards={gamePlayersCard?.[winner?.userId]} 
      />}
    </div>
  );
}
