import { NextResponse } from "next/server";
import { getUserData } from "@/util/databaseFunctions";

export async function POST(req, res) {
  const { address } = await req.json();
  const profile = await getUserData(address);
  return NextResponse.json(profile[0]);
}
