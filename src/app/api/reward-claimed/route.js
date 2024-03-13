import { NextResponse } from "next/server";
import { getReward } from "@/util/databaseFunctions";

export async function POST(req, res) {
  const { address } = await req.json();
  const data = await getReward(address);
  console.log(data);
  return NextResponse.json(data[0]);
}
