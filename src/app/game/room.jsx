'use client'
import PlayerPanel from '@/components/player-panel'
import useSWR from 'swr'
import { animated, useSpring, to } from '@react-spring/web'
import stateFetcher from '@/fetcher/state'
import { useEffect, useRef, useState, useCallback } from 'react'
import useLocalStorageState from 'use-local-storage-state'
import Dialog from '@/components/dialog'
import PK from '@/components/pk' 
import classNames from 'classnames'
import { useGameRoom } from '@/hooks/use-game-room'
import BottomController from './bottom-controller'
import NavigationToolbar from '@/components/navigation-toolbar'
import RoundResult from '@/components/round-result'
import RoundWinner from '@/components/round-winner'
import GlobalTips from '@/components/global-tips'
import aleoFetcher from '@/fetcher/aleo'
import { encodeBs58 } from '@/util'
import GameInfo from '@/components/game-info'
import { useGameData } from '@/hooks/useGameData';
import { atom, useAtom } from 'jotai'
import { walletAddressAtom,gameIdAtom } from "@/util/state";

export default function GameRoom({ gameId }) {
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [id, setId] = useAtom(gameIdAtom);
  const [userInfo, setUserInfo] = useLocalStorageState('userinfo')
  const { gameData } = useGameData();
  console.log("gameData on room:", gameData);

  const { data: gameRoom, mutate: gameRoomMutate } = useSWR('local:gameRoom', stateFetcher)
  // const { data: gameUsers, mutate: gameUsersMutate } = useSWR('local:gameUsers', stateFetcher)
  const [gameUsers, gameUsersMutate] = useState(gameData?.size)
  const { data: gamePlayerInfo, mutate: gamePlayerInfoMutate } = useSWR('local:gamePlayerInfo', stateFetcher)
  const { data: gameMessages, mutate: gameMessagesMutate } = useSWR('local:gameMessages', stateFetcher)
  const { data: gamePlayersCard, mutate: gamePlayersCardMutate } = useSWR('local:gamePlayersCard', stateFetcher)
  const { data: gameCountdown, mutate: gameCountdownMutate } = useSWR('local:gameCountdown', stateFetcher)
  const { data: gamePK, mutate: gamePKMutate } = useSWR('local:gamePK', stateFetcher)
  const { data: tabledChips, mutate: tabledChipsMutate } = useSWR('local:tabledChips', stateFetcher)
  const { data: roundResult, mutate: roundResultMutate } = useSWR('local:roundResult', stateFetcher)
  const { data: listBetChips, mutate: listBetChipsMutate } = useSWR('local:listBetChips', stateFetcher)
  const { data: gameCurrentBetChips, mutate: gameCurrentBetChipsMutate } = useSWR('local:gameCurrentBetChips', stateFetcher)
  const { data: roundWinner, mutate: roundWinnerMutate } = useSWR('local:roundWinner', stateFetcher)
  const { data: currentChipIndex, mutate: currentChipIndexMutate } = useSWR('local:currentChipIndex', stateFetcher)
  const { data: allowPK, mutate: allowPKMutate } = useSWR('local:allowPK', stateFetcher)


  const gameServer = useGameRoom(gameId)

  useEffect(() => {
    const state = gameServer?.data ?? {}

    if (state.code === 10012) {
      setUserInfo({ id: -1 })
    }

    if (state.msgType === 0) {
      stateFetcher('local:gameRoom', state.room).then(gameRoomMutate)
      const currentPlayer = state.users.find(v => v.userId === userInfo.id)

      if (state.room.state === 0) {
        stateFetcher('local:tabledChips', []).then(tabledChipsMutate)
        stateFetcher('local:gamePlayersCard', {}).then(gamePlayersCardMutate)
      }

      stateFetcher('local:gameUsers', state.users).then(gameUsersMutate)
      stateFetcher('local:gamePlayerInfo', {
        ...(gamePlayerInfo ?? {}),
        ...(currentPlayer ?? {}),
      }).then(gamePlayerInfoMutate)

      if (state.event) {
        const { event } = state
        if (event.type === 0) {
          console.log(`event${event.type} gamer #${event.userId} Join game (or broadcast if the message is notified) - > the user state`, event)
        } else if (event.type === 1) {
          console.log(`event${event.type} gamer #${event.userId} Prepare the game - > the user state`, event)
        } else if (event.type === 2) {
          console.log(`event${event.type} gamer #${event.userId} In-game - > user status`, event)
        } else if (event.type === 3) {
          console.log(`event${event.type} gamer #${event.userId} Fold - > user status`, event)
        } else if (event.type === 4) {
          console.log(`event${event.type} gamer #${event.userId} PK loser`, event)
          stateFetcher('local:gameCountdown', {}).then(gameCountdownMutate)
          stateFetcher('local:gamePK', event).then(gamePKMutate)
        } else if (event.type === 5) {
          console.log(`event${event.type} gamer #${event.userId} Final Winner - > user status`, event)
          stateFetcher('local:gameCountdown', {}).then(gameCountdownMutate)

        } else if (event.type === 6) {
          console.log(`event${event.type} gamer #${event.userId} Look at the cards`, event)
        } else if (event.type === 7) {
          console.log(`event${event.type} gamer #${event.userId} Call/raise`, event, tabledChips)
          const { x: tableX, y: tableY, width: tableWidth, height: tableHeight } = document.querySelector('.chips-tabled-panel')?.getBoundingClientRect() ?? {}
          const { x: userX, y: userY, width: userWidth, height: userHeight } = document.querySelector(`[data-user-id='${event.userId}']`)?.getBoundingClientRect() ?? {}
          const to = { x: Math.round((.5 - Math.random()) * 280), y: Math.round((.5 - Math.random()) * 200) }
          const fromX = userX + userWidth / 2 - tableX - tableWidth / 2, fromY = userY + userHeight / 2 - tableY - tableHeight / 2
          stateFetcher('local:tabledChips', [
            ...tabledChips,
            {
              from: { x: isNaN(fromX) ? to.x : fromX, y: isNaN(fromY) ? to.y : fromY },
              to, userId: event.userId, value: event.betChips,
              colorIndex: currentChipIndex || 0,
            }
          ]).then(tabledChipsMutate)
        } else if (event.type === 8) {
          console.log(`event ${event.type} gamer #${event.userId} The user sets up automatic betting`, event)
        } else if (event.type === 9) {
          console.log(`event${event.type} gamer #${event.userId} Currently active users`, event)
          stateFetcher('local:allowPK', false).then(allowPKMutate)
          const now = Date.now()
          const endTime = now + event.countdownSecond * 1000
          const startTime = endTime - event.totalSecond * 1000

          if (event.myselfCard) {
            stateFetcher('local:gamePlayersCard', { ...gamePlayersCard, [userInfo.id]: event.myselfCard.split(', ').map(v => parseInt(v)) }).then(gamePlayersCardMutate)
          }
          // listBetChips
          if (event.listBetChips) {
            stateFetcher('local:listBetChips', event.listBetChips).then(listBetChipsMutate)
          }
          stateFetcher('local:gameCurrentBetChips', event.betChips).then(gameCurrentBetChipsMutate)

          stateFetcher('local:gameCountdown', {
            userId: event.userId,
            countdownSecond: event.countdownSecond,
            totalSecond: event.totalSecond,
            betChips: event.betChips,
            startTime, endTime,
          }).then(gameCountdownMutate)
        } else if (event.type === 10) {
          console.log(`event${event.type} gamer #${event.userId} Bad request`, event)
        } else if (event.type === 11) {
          console.log(`event${event.type} gamer #${event.userId} clause${state.room.currRound}The end of the round`, event)
          stateFetcher('local:allowPK', false).then(allowPKMutate)
          stateFetcher('local:roundResult', { userId: event.userId, records: event.records, isGameOver: !!event.isGameOver }).then(roundResultMutate)
          stateFetcher('local:gameCountdown', {}).then(gameCountdownMutate)
          stateFetcher('local:roundWinner', { userId: event.userId, animationSecond: event.animationSecond }).then(roundWinnerMutate)
          console.log('The game process is chained')
          const cUser = event.records.find(u => u.userId === currentPlayer?.userId)
          if (cUser && cUser?.amount) {
            aleoFetcher('execute', {
              programID: 'game_3_card_poker_v01.aleo',
              functionName: 'save_result',
              inputs: [
                `${encodeBs58(state.room.gameId)}field`, // game_id
                `${encodeBs58(state.room.currRound)}u64`, // round_id
                currentPlayer.address,
                `${encodeBs58(event.userId === currentPlayer.userId ? 1 : 0)}u64`, // state
                `${encodeBs58(event.records.find(u => u.userId === currentPlayer.userId).amount)}u64`, // amount
              ].join('&&')
            }).then((result) => { console.log(result, 'The result of the game process being chained') })
          }
        }
      }
      if (tabledChips.length === 0) {
        const { x: tableX, y: tableY, width: tableWidth, height: tableHeight } = document.querySelector('.chips-tabled-panel')?.getBoundingClientRect() ?? {}
        stateFetcher('local:tabledChips', state.betChips?.map((value, i) => {
          if (tabledChips[i]) return tabledChips[i]
          const { userId } = state.users[i % state.users.length]
          const { x: userX, y: userY, width: userWidth, height: userHeight } = document.querySelector(`[data-user-id='${userId}']`)?.getBoundingClientRect() ?? {}
          const to = { x: Math.round((.5 - Math.random()) * 220), y: Math.round((.5 - Math.random()) * 220) }
          const fromX = userX + userWidth / 2 - tableX - tableWidth / 2, fromY = userY + userHeight / 2 - tableY - tableHeight / 2
          // console.log(userId, state.users, document.querySelector(`[data-user-id='${userId}']`), '<<<<', { tableX, tableY, tableWidth, tableHeight, userX, userY })
          return { from: { x: isNaN(fromX) ? to.x : fromX, y: isNaN(fromY) ? to.y : fromY }, to, userId, value }
        })).then(tabledChipsMutate)
      }
    } else if (state.msgType === 1) {

    } else if (state.msgType === 2) {

    } else if (state.msgType === 3) {

    } else if (state.msgType === 4) {

    } else if (state.msgType === 5) {
      stateFetcher('local:gamePlayersCard',
        Object.entries(state.cards).reduce((v, [id, cards]) => {
          return { ...v, [id]: cards.split(', ').map(v => parseInt(v)) }
        }, gamePlayersCard)
      ).then(gamePlayersCardMutate)
    } else if (state.msgType === 6) {
      stateFetcher('local:gameCurrentBetChips', state.betChips).then(gameCurrentBetChipsMutate)
      stateFetcher('local:gamePlayersCard', { ...gamePlayersCard, [gamePlayerInfo.userId]: state.card.split(', ').map(v => parseInt(v)) }).then(gamePlayersCardMutate)
    } else if (state.msgType === 7) {

    } else if (state.msgType === 8) {
      stateFetcher('local:gamePlayerInfo', { ...(gamePlayerInfo ?? {}), isAutoBet: state.isAutoBet, }).then(gamePlayerInfoMutate)
    } else if (state.msgType === 9) {

    } else if (state.msgType === 10) {
      stateFetcher('local:gameMessages', [...(gameMessages ?? []), state.message]).then(gameMessagesMutate)
    }
  }, [gameServer.data])

  useEffect(() => {
    // Set up Socket.IO event listeners
    socket.on('playerJoined', handlePlayerJoined);
    socket.on('playerLeft', handlePlayerLeft);
    socket.on('tournamentStarted', handleTournamentStarted);

    return () => {
      socket.off('playerJoined', handlePlayerJoined);
      socket.off('playerLeft', handlePlayerLeft);
      socket.off('tournamentStarted', handleTournamentStarted);
    };
  }, []);

  const handleTournamentInvitation = ({ tournamentId, invitedBy, invitationChannel }) => {
    // Display the invitation to the user UI - Get the user's response (accept or decline)
    const response = window.confirm(`You have been invited to join tournament ${tournamentId} by ${invitedBy}. Do you want to accept?`);

    // Join the invitation channel
    socket.emit('joinTournament', tournamentId, playerData);

    // Respond to the invitation
    if (response) {
      setInvitationResponse('accept');
      socket.emit('invitationResponse', {
        tournamentId,
        invitedBy,
        invitee: socket.id,
        accepted: true
      });
    } else {
      setInvitationResponse('decline');
      socket.emit('invitationResponse', {
        tournamentId,
        invitedBy,
        invitee: socket.id,
        accepted: false
      });
    }
  };

  const handlePlayerJoined = (playerData) => {
    setPlayers((prevPlayers) => [...prevPlayers, playerData]);
  };

  const handlePlayerLeft = (playerId) => {
    setPlayers((prevPlayers) => prevPlayers.filter((player) => player.id !== playerId));
  };

  const handleTournamentStarted = (gameState) => {
    setGameStarted(true);
  };


  return (
    <>
      <div className='hidden scale-[0.975]'></div>
      <div className='game-panel transition-transform relative w-[1280px] h-[720px] m-20 mx-auto bg-[url("/bg-3.jpg")] select-none rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.8)]'
        onTransitionEnd={e => {
          e.target.classList.remove('scale-[0.975]')
        }}
      >
        <NavigationToolbar />
        <GameInfo />

        <BottomController></BottomController>
        <PlayerPanel></PlayerPanel>
        <div className='chips-tabled-panel absolute top-[125px] left-1/2 w-[220px] h-[220px] -translate-x-1/2 pointer-events-none'>
          <div className='flex items-center justify-center h-full'>
            {tabledChips?.map?.(({ from, to, value, colorIndex }, index) => <ValuedChips key={`table_chips_${index}`} from={from} to={to} value={value} colorIndex={colorIndex} />)}
          </div>
        </div>
        <PK />
      </div>
      <RoundResult />
      <RoundWinner />
      <GlobalTips />
    </>
  )
}


function ValuedChips({
  className,
  value = '',
  from = { x: 0, y: 0 },
  to: positionTo = { x: 0, y: 0 },
  colorIndex = 0,
}) {
  const styles = useSpring(
    {
      from: { x: from.x, y: from.y },
      to: { x: positionTo.x, y: positionTo.y },
      duration: 10000,
    }
  )

  return (
    <animated.div className='absolute w-12 h-12' style={{ transform: to([styles.x, styles.y], (x, y) => `translate(${x}px,${y}px`) }}>
      <div className='absolute inset-0 bg-black/60 rounded-full blur-[2px] translate-y-0.5' />
      <animated.div className={
        classNames(
          'absolute inset-0 bg-cover bg-no-repeat bg-[url("/chips-blank-2.png")] flex items-center justify-center font-black text-white',
          value < 1000 ? 'text-base' : 'text-xs',
        )
      } style={{ transform: to(styles.x, x => `rotate(${x * 2}deg)`), backgroundImage: `url("/chips-blank-${colorIndex + 1}.png")` }}>{value}</animated.div>
    </animated.div>
  )
}