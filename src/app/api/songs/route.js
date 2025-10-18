import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // ✅ Vercel 환경변수로 설정할 URI
const client = new MongoClient(uri);

export async function GET() {
  try {
    await client.connect();
    const db = client.db("playlist"); // ✅ DB 이름 (소문자로 정확히 맞추세요)
    const songs = await db.collection("songs").find().toArray();

    return NextResponse.json(songs);
  } catch (error) {
    console.error("❌ MongoDB 불러오기 실패:", error);
    return NextResponse.json({ error: "서버 오류 발생" }, { status: 500 });
  } finally {
    await client.close();
  }
}
