import FrameBox from './frame-box'
import StyledButton from './styled-button'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { addPlayerData } from '@/util/databaseFunctions'
import { FaStarOfLife } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { atom, useAtom } from 'jotai'
import { walletAddressAtom } from "@/util/state";


// ShareLink component - used for sharing a match link
export default function CreateProfilePopUp({ onClose, link }) {
  const router = useRouter()
  const [url, setUrl] = useState(null)
  const [copyed, setCopyed] = useState(false)
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const userType = "player"

  const [formData, setFormData] = useState({
    name: "",
    social: "",
    inviteCode: "",
  });

  useEffect(() => {
    // On component mount, the URL is constructed and set
    const currentUrl = new URL(link, location.origin)
    setUrl(currentUrl.toString())
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("form data", formData)
    addPlayerData(walletAddress, userType, formData)
    router.push("/create");
  };

  // Main return method that renders the share link UI
  return (
    <FrameBox
      title={<div className='bg-no-repeat bg-top h-[96px] -translate-y-1/2'></div>}
      onClose={onClose} // onClose prop for closing the component
      showClose={true} // Option to hide the close button
    >
      <div className='w-[560px] m-10 text-center text-white'>
        <h4 className='text-3xl font-black'>Create Your Profile</h4>
        <p>Welcome To MinaPoker</p>
        <form onSubmit={handleSubmit}>
          <div className="relative pb-3">
            <div className="text-black px-2 md:px-0 flex">Your Name {<FaStarOfLife size={6} className="text-red-600 mt-1 mx-2" />}
            </div>
            <div className="mt-3 ">
              <span className="absolute inset-y-0 top-5 right-0 flex items-center pr-4">
                <AiOutlineUser size={25} className="text-gray-400" />
              </span>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                placeholder="John Carter"
                onChange={handleChange}
                required
                className="peer px-6 py-2 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
              />
            </div>
          </div>

          <div className="relative pb-3">
            <div className="text-black px-2 md:px-0 flex">Your Social Profile {<FaStarOfLife size={6} className="text-red-600 mt-1 mx-2" />}
            </div>
            <div className="mt-3 text-black">
              <span className="absolute inset-y-0 top-5 right-0 flex items-center pr-4">
                <MdOutlineEmail size={25} className="text-gray-400" />
              </span>
              <input
                type="text"
                id="social"
                name="social"
                value={formData.social}
                placeholder="Share your X profile link"
                onChange={handleChange}
                required
                className="peer px-6 py-2 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
              />
            </div>
          </div>



          <div className=" h-[0px] border my-3 border-neutral-300"></div>

          <div className="relative pb-3 rounded">
            <div className="text-black px-2 md:px-0 flex">Invite Code
            </div>
            <div className="mt-3 ">

              <input
                type="text"
                id="inviteCode"
                name="inviteCode"
                value={formData.inviteCode}
                placeholder="mina12345"
                onChange={handleChange}
                className="peer px-6 py-2 border flex gap-6 border-slate-200  bg-white w-full rounded-[20px] text-slate-700 dark:text-slate-600 hover:border-slate-200 hover:shadow transition duration-150"
              />
              
            </div>
          </div>

          <div className="flex align-middle justify-center items-center">
            <StyledButton type="submit" className='bg-[#ff9000] m-2' roundedStyle='rounded-full'>
              <div className='text-2xl text-black' >LET'S GO</div>
            </StyledButton>
          </div>
        </form>
      </div>
      <div className='flex justify-center'>

      </div>
    </FrameBox>
  )
}
