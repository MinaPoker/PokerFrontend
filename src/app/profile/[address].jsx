
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import Link from "next/link";


import styles from "@/styles/Profile.module.css";
import randomColor from "@/util/randomColor";


const [randomColor1, randomColor2, randomColor3, randomColor4] = [
    randomColor(),
    randomColor(),
    randomColor(),
    randomColor(),
];


export default function ProfilePage() {
    const router = useRouter();
    // const [tab, setTab] = useState<"nfts" | "coins" | "listings" | "auctions">("nfts");
    const [tab, setTab] = useState("nfts");
    const [data, setData] = useState([]);
    const address = router.query.address;

    console.log("address", address)

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`https://explorer.supabase.com/api?module=account&action=tokenlist&address=${router.query.address}`);
            const jsonData = await response.json();
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            console.log("JSON DATA", jsonData)
            setData(jsonData);
        };
        fetchData();
    }, [address]);

    return (
        <div className="pt-4 h-full text-white bg-black">
            <Header />
            <div className="px-6 pt-4">
                <div
                    className={styles.coverImage}
                    style={{
                        background: `linear-gradient(90deg, ${randomColor1}, ${randomColor2})`,
                    }}
                />
                <div
                    className={styles.profilePicture}
                    style={{
                        background: `linear-gradient(90deg, ${randomColor3}, ${randomColor4})`,
                    }}
                />
                <h1 className={styles.profileName}>
                    <div>0xshikhar.eth</div>
                    {router.query.address}
                    {/* {router.query.address ? (
              router.query.address.toString().substring(0, 4) +
              "..." +
              router.query.address.toString().substring(38, 42)
            ) : (
              <Skeleton width="320" />
            )} */}
                </h1>
            </div>
            <div className="mx-10 pb-9">
                <div className={styles.tabs}>
                    <h3
                        className={`${styles.tab} 
          ${tab === "nfts" ? styles.activeTab : ""}`}
                        onClick={() => setTab("nfts")}
                    >
                        NFTs
                    </h3>
                    <h3
                        className={`${styles.tab} 
          ${tab === "coins" ? styles.activeTab : ""}`}
                        onClick={() => setTab("coins")}
                    >
                        Coins
                    </h3>
                    <h3
                        className={`${styles.tab} 
          ${tab === "listings" ? styles.activeTab : ""}`}
                        onClick={() => setTab("listings")}
                    >
                        Listings
                    </h3>
                    <h3
                        className={`${styles.tab}
          ${tab === "auctions" ? styles.activeTab : ""}`}
                        onClick={() => setTab("auctions")}
                    >
                        Auctions
                    </h3>
                </div>

                <div
                    className={`${tab === "nfts" ? styles.activeTabContent : styles.tabContent
                        }`}
                >

                    {data?.status == "0" ? <div>loading...</div> :
                        <div className="overflow-x-auto w-full h-full m-2  bg-black text-white">
                            <table className="table-auto w-full bg-black text-white">
                                <thead>
                                    <tr>
                                        <th>NFT Collection Name</th>
                                        <th>Symbol</th>
                                        <th>Quantity</th>
                                        <th>Contract Address</th>
                                    </tr>
                                </thead>

                                {/* row 1 */}

                                {data.result?.map((item, id) =>
                                (item.type == 'ERC-721' ?
                                    <tbody>
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.symbol}</td>
                                            <td>{item.balance}</td>
                                            <td>{item.contractAddress}</td>
                                            <button onClick={() => {
                                                router.push(`/user/${item.contractAddress}`);
                                            }} className="text-white px-2">View NFTs</button>
                                            {/* <Link href="">
                        <button>See NFTs</button>
                      </Link> */}
                                        </tr>
                                    </tbody>
                                    : ' '
                                ))
                                }
                                {/* </tr> */}
                                {/* </tbody> */}
                            </table>
                        </div>
                        // <div>
                        //   <ul>
                        //     {data.result?.map((item, id) => (item.type == 'ERC-721' ? <li key={id}>{item.name}</li> : ' '))
                        //     }
                        //   </ul>
                        // </div>
                    }

                </div>

                <div
                    className={`${tab === "coins" ? styles.activeTabContent : styles.tabContent
                        }`}
                >

                    {data?.status == "0" ? <div>loading...</div> :

                        <div className="overflow-x-auto w-full h-full m-2  bg-black text-white">
                            <table className="table-auto w-full bg-black text-white">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Symbol</th>
                                        <th>Contract Address</th>
                                        <th>Balance</th>
                                        <th>Decimal Places</th>
                                    </tr>
                                </thead>

                                {/* row 1 */}

                                {data.result?.map((item, id) =>
                                (item.type == 'ERC-20' ?
                                    <tbody>
                                        <tr>
                                            <td>{item.name}</td>
                                            <td>{item.symbol}</td>
                                            <td>{item.contractAddress}</td>
                                            <td>{item.balance}</td>
                                            <td>{item.decimals}</td>
                                        </tr>
                                    </tbody>

                                    : ' '
                                ))
                                }
                                {/* </tr> */}
                                {/* </tbody> */}
                            </table>
                        </div>
                    }

                </div>
            </div>
        </div>
    );
}
