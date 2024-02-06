'use client'
import { UserCircleIcon, PhotoIcon } from '@heroicons/react/24/solid'
// import WithSignined from './with-signin'
import { RadioGroup } from '@headlessui/react'
import { useCallback, useEffect, useState, useRef } from 'react'
import classNames from 'classnames'
import { useRouter } from 'next/navigation'
import useLocalStorageState from 'use-local-storage-state'
import StyledButton from '@/components/styled-button'
import SVGText from '@/components/svg-text'
import NavigationToolbar from '@/components/navigation-toolbar'
import aleoFetcher from '@/fetcher/aleo'
import { encodeBs58 } from '@/util'
import ShareLink from '@/components/share-link'
import { useGameData } from '@/hooks/useGameData'
import { createPokerGame } from '@/util/databaseFunctions'
import { generateUniquePokerId } from '@/util'
import { atom, useAtom } from 'jotai'
import { walletAddressAtom, gameIdAtom } from "@/util/state";
import { toast } from 'react-toastify'
// import { io } from "socket.io-client";
import socket from '@/util/socket'

export default function CreateGamePage() {

    const router = useRouter()
    const { gameData, setGameData } = useGameData();
    const socketRef = useRef();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);


    // useEffect(() => {
    //     // Connect to the Socket.IO server
    //     socketRef.current = io('http://localhost:3000/api/socket', { path: "/api/socketio" });
    //     console.log("socketRef.current working", socketRef.current)
    //     // Event listener for receiving invites
    //     socketRef.current.on('invitePlayer', (data) => {
    //         console.log('Received game invite:', data);
    //         // Handle invitation logic (display, accept, reject, etc.)
    //     });

    //     return () => socketRef.current.disconnect();
    // }, []); Research rollup bitcoin

    // const socket = io({ path: "/api/socketio" });

    // socket.on("connect", () => {
    //     console.log("Connected to the server");
    // });

    useEffect(() => {

        socket.on("message", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        return () => {
            socket.off("message");
        };

    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            socket.emit("message", message);
            setMessage("");
        }
    };

    // Function to send an invite
    const sendInvite = (playerBId, gameId) => {
        console.log("socketRef.current", playerBId, gameId)
        socketRef.current.emit('invitePlayer', { playerBId, gameId });
    };


    const [minimum, setMinimum] = useState(2)
    const [lowBetChips, setLowBetChips] = useState(2)
    const [topBetChips, setTopBetChips] = useState(20)
    const [totalRounds, setTotalRounds] = useState(2)
    const [gameId, setGameId] = useAtom(gameIdAtom)
    const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);

    const [handleSubmitState, setHandleSubmitState] = useState(false)
    const [coLoading, setCoLoading] = useState(false);

    const handleCreateGame = async () => {
        const newId = generateUniquePokerId();
        console.log("newId", newId)
        setCoLoading(true);
        setGameId(newId)
        console.log("input data", minimum, lowBetChips, topBetChips, totalRounds, gameId, newId);
        // setGameData(newGameData);
        // sendInvite('as34512532', newId)

        setGameData({
            gameId: newId,
            size: minimum,
            lowBetChips: lowBetChips,
            topBetChips: topBetChips,
            totalRounds: totalRounds,
        });

        // Simulate a delay (e.g., 1 second) to mimic an API call.
        setTimeout(() => {
            setCoLoading(false);
            if (walletAddress) {
                setHandleSubmitState(true);
                createPokerGame(walletAddress, gameData);
            }
            else {
                toast.error('Wallet is not connected', {
                    position: "top-right",
                    autoClose: 3000,
                });
            }

            console.log('Create a game on-chain (simulated)');
        }, 2000);
    };

    return (
        <>
            <div className='bg-white w-[1280px] h-[720px] overflow-hidden mx-auto my-8 px-4 py-2 rounded-lg bg-cover bg-[url("/bg-2.jpg")] relative shadow-[0_0_20px_rgba(0,0,0,0.8)]'>
                {/* <div className='absolute top-5 left-5 w-40 h-40 bg-no-repeat bg-[url("/logo.png")]'></div> */}
                <div className='absolute inset-0 bg-no-repeat bg-[url("/table-1.png")]'></div>
                <div className='absolute left-8 -right-8 top-14 -bottom-14 bg-no-repeat bg-[url("/dealer.png")] transform-gpu'>
                    <div className='absolute -left-8 right-8 -top-14 bottom-14 bg-no-repeat bg-[url("/card-0.png")] animate-floating'></div>
                </div>
                <div className='absolute top-0 left-1/2 right-0 bottom-0 pr-10 pt-28'>
                    <NavigationToolbar />
                    <div className='text-white font-black text-right text-6xl'>CREATE A GAME</div>
                    <div className='text-white font-black text-right'>
                        Choose the settings for you new match.<br />
                        The power in your hands.
                    </div>

                    <div>
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message..."
                        />
                        <button onClick={sendMessage}>Send</button>
                        <ul>
                            {messages.map((msg, index) => (
                                <li key={index}>{msg}</li>
                            ))}
                        </ul>
                    </div>

                    <div className='text-right'>
                        <div className='flex gap-6 my-6 items-center'>
                            <div className='text-white font-black text-right w-32'>PLAYERS</div>
                            <div className='flex flex-1 items-stretch gap-2 text-white text-center justify-around'>
                                <div className='relative' onClick={() => setMinimum(2)}>
                                    <img className='cursor-pointer' src='/players-2.png' />
                                    2 Players
                                    {minimum === 2 && <img className='absolute top-3 left-9' src='/checked.png' />}
                                </div>
                                <div className='relative' onClick={() => setMinimum(3)}>
                                    <img className='cursor-pointer' src='/players-3.png' />
                                    3 Players
                                    {minimum === 3 && <img className='absolute top-3 left-9' src='/checked.png' />}
                                </div>
                                <div className='relative' onClick={() => setMinimum(4)}>
                                    <img className='cursor-pointer' src='/players-4.png' />
                                    4 Players
                                    {minimum === 4 && <img className='absolute top-3 left-9' src='/checked.png' />}
                                </div>
                                <div className='relative' onClick={() => setMinimum(5)}>
                                    <img className='cursor-pointer' src='/players-5.png' />
                                    5 Players
                                    {minimum === 5 && <img className='absolute top-5 left-12' src='/checked.png' />}
                                </div>
                            </div>
                        </div>

                        <div className='flex gap-6 my-6'>
                            <div className='text-white font-black text-right w-32'>LOW BET CHIPS</div>
                            <div className='flex-1'>
                                <MyRange min={1} max={100} value={lowBetChips} onChange={setLowBetChips} className='bg-[url("/range-icon.png")]' />
                            </div>
                            <div className='bg-black/20 text-white rounded-full w-12 h-6 px-2 text-right'>{lowBetChips}</div>
                        </div>

                        <div className='flex gap-6 my-6'>
                            <div className='text-white font-black text-right w-32'>TOP BET CHIPS</div>
                            <div className='flex-1'>
                                <MyRange min={200} max={10000} value={topBetChips} onChange={setTopBetChips} className='bg-[url("/range-icon.png")]' />
                            </div>
                            <div className='bg-black/20 text-white rounded-full w-12 h-6 px-2 text-right'>{topBetChips}</div>
                        </div>

                        <div className='flex gap-6 my-6'>
                            <div className='text-white font-black text-right w-32'>TOTAL ROUNDS</div>
                            <div className='flex-1'>
                                <MyRange min={1} max={5} value={totalRounds} onChange={setTotalRounds} className='bg-[url("/range-icon2.png")]' />
                            </div>
                            <div className='bg-black/20 text-white rounded-full w-12 h-6 px-2 text-right'>{totalRounds}</div>
                        </div>

                    </div>
                    <StyledButton
                        className="text-lg bg-[#00b69a]"
                        onClick={handleCreateGame}

                    >
                        CREATE A GAME
                    </StyledButton>
                </div>
            </div>

            {coLoading && <div className='fixed top-0 left-0 w-screen h-screen bg-black/50 z-50 flex justify-center items-center'>
                <div>
                    <div className='text-center text-white'>
                        <div className='inline-block w-40 h-40 bg-no-repeat bg-center bg-[url("/loading-icon.png")]'>
                            <div className='w-40 h-40 bg-no-repeat bg-center bg-[url("/loading-icon-fg.png")] animate-[spin_1.6s_linear_infinite]'></div>
                        </div>
                        <p className='text-2xl font-black my-8'>Data cochain ...</p>
                        <p>It is expected to take 10 seconds,</p>
                        <p>please be patient!</p>
                        <StyledButton className='bg-[#ff9000] m-8' roundedStyle='rounded-full' onClick={() => { setCoLoading(false) }}>
                            <div className='text-2xl'>CANCEL</div>
                        </StyledButton>
                    </div>
                </div>
            </div>}
            {handleSubmitState && gameId && <ShareLink link={`/game?gameId=${gameId}`} />}
        </>
    )
}




function MyRange({
    min = 1, max, className, step = 1, value,
    onChange = () => { }
}) {
    const inputRef = useRef(null)
    const valueRef = useRef(null)

    const changeHandle = useCallback(({ target }) => {
        const { min, max, value } = target
        const v = (value - min) / (max - min)
        valueRef.current.style.width = v * 100 + '%'
        onChange(Number(value))
    }, [inputRef.current, valueRef.current])

    useEffect(() => {
        changeHandle({ target: inputRef.current })
    }, [inputRef.current, valueRef.current])

    return (
        <div className='w-full relative h-4 select-none cursor-pointer translate-y-1'>
            <div className='absolute inset-0 bg-black/30 rounded-full shadow-[inset_0_0_10px_0_rgba(0,0,0,.8)]'>
                <div ref={valueRef} className='absolute top-0.5 bottom-0.5 left-0.5 bg-gradient-to-b from-[#fad000] to-[#f49d00] rounded-full'>
                    <div className='absolute right-0 top-1/2 w-0 h-0'>
                        <div className={classNames('w-10 h-10 -translate-x-1/2 -translate-y-1/2 bg-no-repeat bg-center', className)}></div>
                    </div>
                </div>
            </div>
            <input className='w-full h-full relative opacity-0'
                ref={inputRef}
                onChange={changeHandle}
                type='range' step={step} min={min} max={max} defaultValue={value}
            />
        </div>
    )
}

