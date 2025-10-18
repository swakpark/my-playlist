"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeContent() {
  const [songs, setSongs] = useState([]);
  const [genre, setGenre] = useState("all");
  const [mood, setMood] = useState("all");
  const [modalSong, setModalSong] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // ✅ MongoDB에서 노래 불러오기
  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => setSongs(data))
      .catch((err) => console.error("노래 불러오기 실패:", err));
  }, []);

  // ✅ URL의 song 파라미터에 따라 모달 표시
  useEffect(() => {
    const songId = searchParams.get("song");
    if (songId) {
      const song = songs.find((s) => s.videoId === songId);
      setModalSong(song || null);
    } else {
      setModalSong(null);
    }
  }, [searchParams, songs]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (modalSong) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
  }, [modalSong]);

  const genres = [
    "all", "POP", "K-POP", "J-POP", "Animation", "Rock",
    "Hip-hop (KR)", "Hip-hop (US)", "R&B (KR)", "R&B (US)",
    "발라드", "OST", "인디"
  ];

  const moods = [
    "all", "새벽", "퇴근길", "여름", "겨울",
    "드라이브", "비오는 날", "여행", "사랑", "이별", "카페"
  ];

  const filteredSongs = songs.filter(
    (song) =>
      (genre === "all" || song.genre === genre) &&
      (mood === "all" || song.mood === mood)
  );

  const getThumbnail = (videoId) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  const getEmbedUrl = (videoId) => `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  const openModal = (song) => router.push(`?song=${song.videoId}`, { shallow: true });
  const closeModal = () => router.push("/", { shallow: true });
  const getRandomSong = () => {
    const random = songs[Math.floor(Math.random() * songs.length)];
    openModal(random);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-4 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10 text-center">
        🎧 주인장 플레이리스트
      </h1>

      {/* 장르 버튼 */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-full border text-sm md:text-base ${
              genre === g
                ? "bg-white text-black font-bold"
                : "border-gray-500 hover:bg-gray-800"
            }`}
          >
            {g === "all" ? "전체" : g}
          </button>
        ))}
      </div>

      {/* 감성 버튼 */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(m)}
            className={`px-3 md:px-4 py-1 md:py-2 rounded-full border text-sm md:text-base ${
              mood === m
                ? "bg-blue-400 text-black font-bold"
                : "border-gray-500 hover:bg-gray-800"
            }`}
          >
            {m === "all" ? "모두" : m}
          </button>
        ))}
      </div>

      {/* 랜덤 추천 */}
      <div className="text-center mb-6">
        <button
          onClick={getRandomSong}
          className="px-6 py-2 md:px-8 md:py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition font-semibold text-sm md:text-base"
        >
          🎲 오늘의 추천곡
        </button>
      </div>

      {/* 노래 카드 */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {filteredSongs.map((song, index) => (
          <motion.div
            key={song.videoId || `${song.title}-${index}`}
            whileTap={{ scale: 0.97 }}
            className="group border border-gray-700 rounded-2xl overflow-hidden hover:bg-gray-800 transition cursor-pointer"
            onClick={() => openModal(song)}
          >
            <img
              src={getThumbnail(song.videoId)}
              alt={song.title}
              className="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition-transform"
            />
            <div className="p-3 md:p-4">
              <div className="text-base md:text-lg font-semibold mb-1 group-hover:text-blue-400">
                {song.title}
              </div>
              <div className="text-gray-400 text-sm md:text-base mb-1">{song.artist}</div>
              <div className="text-xs md:text-sm text-gray-500">
                {song.genre} · {song.mood}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {modalSong && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-black rounded-xl overflow-hidden w-full max-w-lg relative"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-2xl md:text-3xl font-bold hover:text-red-500 z-50"
              >
                &times;
              </button>

              <div className="relative w-full pt-[56.25%]">
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded-t-xl"
                  src={getEmbedUrl(modalSong.videoId)}
                  title={modalSong.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <div className="p-4">
                <h2 className="text-xl md:text-2xl font-bold mb-1">{modalSong.title}</h2>
                <p className="text-gray-400 mb-1">{modalSong.artist}</p>
                <p className="text-sm text-gray-500 mb-2">
                  {modalSong.genre} · {modalSong.mood}
                </p>
                <a
                  href={`https://www.youtube.com/watch?v=${modalSong.videoId}`}
                  target="_blank"
                  className="inline-block bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-sm md:text-base font-medium"
                >
                  ▶️ 유튜브에서 보기
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center text-gray-500 mt-10 md:mt-16 text-sm md:text-base">
        <p>© {new Date().getFullYear()} 주인장 플레이리스트</p>
      </footer>
    </main>
  );
}
