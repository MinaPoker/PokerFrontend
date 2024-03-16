import FrameBox from "./frame-box";
import StyledButton from "./styled-button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { addPlayerData } from "@/util/databaseFunctions";
import { FaStarOfLife } from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import { AiOutlineUser } from "react-icons/ai";
import { atom, useAtom } from "jotai";
import { walletAddressAtom } from "@/util/state";
import { Buffer } from "buffer";
import axios from "axios";
import { toast } from "react-toastify";

// ShareLink component - used for sharing a match link
export default function CreateAvatarPopUp({ onClose, link }) {
  const router = useRouter();
  const [avatars, setAvatars] = useState([]);
  const [url, setUrl] = useState(null);
  const [copyed, setCopyed] = useState(false);
  const [walletAddress, setWalletAddress] = useAtom(walletAddressAtom);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const userType = "player";

  const api = "https://api.multiavatar.com/45678948";

  const [formData, setFormData] = useState({
    name: "",
    social: "",
    inviteCode: "",
  });

  useEffect(() => {
    // On component mount, the URL is constructed and set
    const currentUrl = new URL(link, location.origin);
    setUrl(currentUrl.toString());
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("form data", formData);
    addPlayerData(walletAddress, userType, formData);
    toast.success("Avatar Created Successfully")
    router.push("/create");
  };

  const fetchAvatars = async () => {
    const data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        `${api}/${Math.round(Math.random() * 1000)}`
      );
      const buffer = Buffer.from(image.data);
      data.push(buffer.toString("base64"));
    }
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      const avatarsData = await fetchAvatars();
      setAvatars(avatarsData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Main return method that renders the share link UI
  return (
    <FrameBox
      title={
        <div className="bg-no-repeat bg-top h-[96px] -translate-y-1/2"></div>
      }
      onClose={onClose} // onClose prop for closing the component
      showClose={true} // Option to hide the close button
    >
      <div className="w-[560px] m-10 text-center text-white">
        <h4 className="text-3xl font-black">Choose the Avatar</h4>
        <div className="flex gap-8 p-14">
          {isLoading && <p> LOADING .... </p>}
            {avatars.map((avatar, index) => {
              return (
                <div
                  key={index}
                  className={`avatar ${
                    selectedAvatar === index
                      ? "selected border-solid border-4 border-purple-600  rounded-full"
                      : " "
                  } `}
                >
                  <img
                    className="h-24"
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    key={avatar}
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
        <form onSubmit={handleSubmit}>
          <div className="flex align-middle justify-center items-center">
            <StyledButton
              type="submit"
              className="bg-[#ff9000] m-2"
              roundedStyle="rounded-full"
            >
              <div className="text-2xl text-black">Set As Avatar</div>
            </StyledButton>
          </div>
        </form>
      </div>
      <div className="flex justify-center"></div>
    </FrameBox>
  );
}
