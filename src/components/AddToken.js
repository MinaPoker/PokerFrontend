import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { RxCross2 } from "react-icons/rx";

// ShareLink component - used for sharing a match link
export default function AddFundPopUp({ openHandler, balance, setBalance }) {
    const router = useRouter()
    const [amount, setAmount] = useState(0);

    const handleClick = (event) => {
        const value = parseInt(event.target.getAttribute('data-value'));
        const total = amount + value;
        setAmount(total)
    };

    const ISSERVER = typeof window === "undefined";git 
    const [tokenAmount, setTokenAmount] = useState(0);

    useEffect(() => {
        if (!ISSERVER) {
            // Retrieve game data from local storage
            const storedUserData = localStorage.getItem('amount');

            if (storedUserData) {
                setTokenAmount(storedUserData);
            }
        }
    }, [balance]);

    const BuyToken = () => {
        if (!ISSERVER) {
            setBalance(amount)
            const previousAmount = localStorage.getItem('amount')
            localStorage.setItem('amount', parseInt(previousAmount) + amount);
        }
    }

    return (
        <div className="bg-[url('/dialog-background.png')] bg-cover bg-center h-[96px] -translate-y-1/2 relative">
            {/* Use absolute positioning for the close button */}
            <button className="absolute top-3 right-3 text-white" onClick={openHandler}>
                <RxCross2 />
            </button>
            
            <div className='container mx-auto w-[560px] mt-10 text-center flex flex-col justify-center text-white' data-testid="add fund">
                <h4 className='text-3xl font-black'>Add Tokens to Your Fund</h4>
                <p>Boost Your Stack, Elevate Your Game: Add Funds with Ease at Minadeck!</p>

                <section className='flex gap-8 w-fit mx-auto mt-4 mb-4'>
                    <button onClick={handleClick} className="flex flex-col items-center">
                        <img src="/chips-blank-1.png" data-value="10" />
                        <p className="text-base">$ 10</p>
                    </button>
                    {/* ... other buttons */}
                </section>

                <div className='flex bg-black/20 justify-between items-center text-white font-semibold rounded-lg p-2'>
                    <div className='bg-black/30 rounded-lg flex items-center justify-between w-2/3 px-4'>
                        <span>{amount}</span> 
                        {amount !== 0 && (
                            <button onClick={() => setAmount(0)}>
                                <RxCross2 className="text-xl" />
                            </button>
                        )}
                    </div>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-pink-500 hover:to-yellow-500 px-6 py-2 rounded-lg font-medium" onClick={BuyToken}>
                        Buy Token
                    </button>
                </div>

                <div className='mt-2 text-gray-200'>select tokens you want to buy</div>

                {/* ...Dialog content for Success message. Adjust styling as needed with Tailwind  */}  
            </div>
        </div>
    )
}
