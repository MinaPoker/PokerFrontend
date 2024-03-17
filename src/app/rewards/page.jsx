"use client";
import React, { useEffect, useState } from "react";
import testImg1 from "@/styles/1.jpg";
import testImg2 from "@/styles/2.jpg";
import testImg3 from "@/styles/3.jpg";
import testImg4 from "@/styles/4.jpg";
import testImg5 from "@/styles/5.jpg";
import testImg6 from "@/styles/6.jpg";
import testImg7 from "@/styles/7.jpg";
import Image from "next/image";
import StyledButton from "@/components/styled-button";
import { toast } from "react-toastify";
import { getStreaks } from "@/util/databaseFunctions";

const page = () => {
  const [streaks, setStreaks] = useState(0);
  useEffect(() => {
    const fetchStreaks = async () => {
      const collectAccounts = await window.mina.requestAccounts();
      const address = collectAccounts[0];
      const response = await getStreaks(address);
      setStreaks(response[0].streaks);
    };
    fetchStreaks();
  }, []);

  const ClaimReward = async () => {
    const collectAccounts = await window.mina.requestAccounts();
    const address = collectAccounts[0];
    let body = JSON.stringify({
      address: address,
    });

    await fetch("http://localhost:3001/api/claim-reward", {
      method: "POST",
      body: body,
    });
    setStreaks(streaks + 1);
    toast.success("Reward Claimed");
  };
  return (
    <div>
      <h1 className="flex items-center justify-center text-3xl text-white p-4 ">
        Rewards Section{" "}
      </h1>
      <div className="flex items-center justify-center min-h-screen h-auto w-auto mx-auto container">
        <div className="flex grid-col-3 gap-3 flex-wrap">
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 0 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $700</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 0}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 1 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $600</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 1}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 2 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $500</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 2}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 3 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $400</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 3}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 4 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $300</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 4}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 5 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $200</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 5}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
          <div
            className={`bg-gray-800 rounded-xl shadow-2xl p-4 m-3 h-[450] w-[450px] ${
              streaks !== 6 ? "opacity-60" : ""
            }`}
          >
            <div className="p-5 flex flex-col">
              <div className="rounded-xl overflow-hidden bg-gray-500">
                <Image src={testImg1} alt="" />
              </div>
              <h5 className="text-2xl md:text-3xl font-medium mt-3 text-white">
                Claim your Todays rewards
              </h5>
              <p className="text-gray-400 text-xl py-2">
                In life, as in poker, its not just about the cards you are
                dealt, but how you play your hand.
              </p>
              <p className="text-gray-200 text-2xl"> Amount : $100</p>
              <div className="flex justify-center items-center pt-7  ">
                <StyledButton
                  disabled={streaks !== 6}
                  onClick={ClaimReward}
                  className="bg-[#00b69a] bottom-4 text-2xl  m-4 "
                >
                  Collect Rewards
                </StyledButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default page;
