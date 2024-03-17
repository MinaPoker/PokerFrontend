import { NextResponse } from "next/server";
import {
  addReward,
  getReward,
  addStreaks,
  getStreaks,
} from "@/util/databaseFunctions";

export async function POST(req, res) {
  const { address } = await req.json();
  const reward = await getReward(address);
  const streak = await getStreaks(address);
  var reward_claimed = reward[0].rewards;
  if (streak[0].streaks === 7) {
    return NextResponse.json({
      reward: reward_claimed,
      streak: streak[0].streaks,
      msg: "Reward claimed",
    });
  }
  var increment = 700 - streak[0].streaks * 100;
  reward_claimed += increment;
  const updateStreaks = await addStreaks(streak[0].streaks + 1, address);
  const data = await addReward(address, reward_claimed);
  return NextResponse.json({
    reward: reward_claimed,
    streak: streak[0].streaks + 1,
    msg: "Reward claimed",
  });
}
