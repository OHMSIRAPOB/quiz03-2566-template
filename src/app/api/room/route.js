import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  let count =0;
  for(const obj of DB.rooms){
    if(!null) count++;
  }
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: count
  });
};

export const POST = async (request) => {
  const payload = checkToken();
  console.log(payload);
  const role = payload.role;

  if (!(role === "ADMIN" || role === "SUPER_ADMIN")) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }
  
  readDB();
  const body = await request.json();
  const { roomName } = body;
  const room = DB.rooms.find((room) => room.roomName === roomName);
  if (room) {
    return NextResponse.json(
      {
        ok: false,
        message: `Room ${roomName} already exists`,
      },
      { status: 400 }
    );
  }

  const roomId = nanoid();
  DB.rooms.push({ roomId, roomName });
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${roomName} has been created`,
  });
};