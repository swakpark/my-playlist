import clientPromise from "../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("playlist");
    const songs = await db.collection("songs").find({}).toArray();
    return new Response(JSON.stringify(songs), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to fetch songs" }), { status: 500 });
  }
}
