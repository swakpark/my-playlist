// scripts/importSongs.js
import fs from "fs";
import { MongoClient } from "mongodb";
import csv from "csv-parser";

const uri = "mongodb://localhost:27017"; // .env.local과 동일
const client = new MongoClient(uri);
const dbName = "playlist";
const collectionName = "songs";

async function importCSV() {
  const results = [];
  fs.createReadStream("PlayList.csv") // CSV 파일 경로
    .pipe(csv())
    .on("data", (data) => {
      // 필드명 일치 확인
      results.push({
        genre: data["장르"],
        artist: data["가수"],
        title: data["제목"],
        mood: data["감성"],
        videoId: data["아이디"] || "",
      });
    })
    .on("end", async () => {
      try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // 기존 데이터 삭제하고 다시 삽입
        await collection.deleteMany({});
        await collection.insertMany(results);

        console.log(`✅ ${results.length}개 곡이 MongoDB에 업로드되었습니다!`);
        await client.close();
      } catch (error) {
        console.error("❌ 업로드 실패:", error);
      }
    });
}

importCSV();
