"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const petData = [
  {
    rarity: "Common",
    pets: ["Starfish", "Crab", "Seagull", "Bunny", "Dog", "Golden Lab"],
  },
  {
    rarity: "Uncommon",
    pets: ["Bee", "Black Bunny", "Cat", "Chicken", "Deer"],
  },
  {
    rarity: "Rare",
    pets: [
      "Monkey",
      "Orange Tabby",
      "Pig",
      "Rooster",
      "Spotted Deer",
      "Flamingo",
      "Toucan",
      "Sea Turtle",
      "Orangutan",
      "Seal",
      "Honey Bee",
      "Wasp",
      "Hedgehog",
      "Kiwi",
    ],
  },
  {
    rarity: "Legendary",
    pets: [
      "Tarantula Hawk",
      "Turtle",
      "Ptal Bee",
      "Moth",
      "Moon Cat",
      "Frog",
      "Mole",
      "Scarlet Macaw",
      "Ostrich",
      "Peacock",
      "Capybara",
      "Sand Snake",
      "Meerkat",
    ],
  },
  {
    rarity: "Mythical",
    pets: [
      "Brown Mouse",
      "Caterpillar",
      "Giant Ant",
      "Grey Mouse",
      "Praying Mantis",
      "Red Fox",
      "Red Giant Ant",
      "Snail",
      "Squirrel",
      "Bear Bee",
      "Butterfly",
      "Echo Frog",
      "Pack Bee",
      "Mimic Octopus",
      "Hyacinth Macaw",
      "Axolotl",
      "Hamster",
    ],
  },
  {
    rarity: "Divine",
    pets: [
      "Dragonfly",
      "Night Owl",
      "Queen Bee",
      "Raccoon",
      "Disco Bee",
      "Fennec Fox",
    ],
  },
];

const videoData = [
  {
    title: "How to Grow a Roblox Garden Fast",
    url: "https://youtu.be/HmIMmFAV4BY?si=Mira7fpfgmuYtEFH",
  },
  {
    title: "Grow a Garden Pet Showcase!",
    url: "https://youtu.be/zugd-NTJNTA?si=EBdIa2H_9u3SHzu1",
  },
  {
    title: "Secret Garden Pet Trick",
    url: "https://youtu.be/ywthKNqI7uI?si=2m_DHkTMaDlROO27",
  },
];

const fakeNames = [
  "xxPetHunter42",
  "GardenGirl",
  "JayJay123",
  "MochiMe",
  "ZebraZebra",
  "BeeLover",
  "EggSnatcher",
  "LeafyBoy",
  "Milo123",
  "KitKat",
  "Watermelon",
];
const allPets = petData.flatMap((g) => g.pets);

function getRarity(pet: string) {
  for (const group of petData) {
    if (group.pets.includes(pet)) return group.rarity;
  }
  return "Unknown";
}

function formatPetFilename(name: string) {
  return name.toLowerCase().replace(/ /g, "_") + ".webp";
}

export default function Home() {
  const [username, setUsername] = useState("");
  const [pet, setPet] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [video, setVideo] = useState<{ title: string; url: string } | null>(
    null
  );
  const [timer, setTimer] = useState(15);
  const [progressStarted, setProgressStarted] = useState(false);

  const [chatLog, setChatLog] = useState<{ user: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const maxPets = 3;
  const weekMs = 7 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      const user = fakeNames[Math.floor(Math.random() * fakeNames.length)];
      const pet = allPets[Math.floor(Math.random() * allPets.length)];
      const msgs = [
        `Just got a ${pet}!`,
        `Yooo ${pet} looks sick`,
        `Did it work for you guys?`,
        `Trying this now`,
        `I hope I get ${pet}`,
        `It sent to my mailbox in like 10 min`,
      ];
      setChatLog((prev) => [
        ...prev.slice(-20),
        { user, text: msgs[Math.floor(Math.random() * msgs.length)] },
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog]);

  useEffect(() => {
    if (progressStarted && timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [progressStarted, timer]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !chatInput.trim()) return;
    setChatLog((prev) => [
      ...prev.slice(-20),
      { user: username, text: chatInput },
    ]);
    setChatInput("");
  };

  const handleGenerate = () => {
    setError("");
    if (!username.trim()) return setError("Username is required.");
    if (!pet) return setError("Please select a pet.");
    if (!captcha) return setError("Please complete the CAPTCHA.");

    const userKey = `pet-history-${username.toLowerCase()}`;
    const history = JSON.parse(
      localStorage.getItem(userKey) || "[]"
    ) as number[];
    const now = Date.now();
    const recent = history.filter((ts) => now - ts < weekMs);

    if (recent.length >= maxPets)
      return setError("You’ve reached the max 3 pets this week.");

    recent.push(now);
    localStorage.setItem(userKey, JSON.stringify(recent));

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setVideo(videoData[Math.floor(Math.random() * videoData.length)]);
      setTimer(15);
      setProgressStarted(false);
      new Audio("/success.mp3").play();
    }, 2500);
  };

  const handleStartProgress = () => {
    if (!progressStarted) setProgressStarted(true);
  };

  const handleReset = () => {
    setSuccess(false);
    setPet("");
    setCaptcha(false);
    setVideo(null);
    setTimer(15);
    setProgressStarted(false);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/grow-bg.jpg')" }}
    >
      <div className="relative max-w-md w-full bg-white/90 backdrop-blur-md rounded-xl shadow-xl p-6 space-y-5">
        <h1 className="text-2xl font-bold text-center text-green-700">
          Grow a Garden Pet Generator
        </h1>

        <input
          type="text"
          placeholder="Enter your Roblox username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        />

        <select
          value={pet}
          onChange={(e) => setPet(e.target.value)}
          className="w-full px-4 py-2 border rounded-md"
        >
          <option value="">Choose a pet</option>
          {petData.map((group) => (
            <optgroup label={group.rarity} key={group.rarity}>
              {group.pets.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <label className="flex items-center space-x-2 text-sm">
          <input
            type="checkbox"
            checked={captcha}
            onChange={() => setCaptcha(!captcha)}
          />
          <span>I am not a robot</span>
        </label>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          onClick={handleGenerate}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-semibold transition-all disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Pet"}
        </button>

        {/* Chatbox */}
        <div className="w-full bg-gray-100 rounded-md p-3 h-40 overflow-y-auto text-sm border border-gray-300">
          <p className="text-xs text-gray-500 mb-1">Live Chat</p>
          {chatLog.map((msg, i) => (
            <div key={i}>
              <span className="font-semibold text-green-700">{msg.user}</span>:{" "}
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleChatSubmit} className="flex mt-2 space-x-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={
              username ? "Type your message..." : "Enter username to chat"
            }
            disabled={!username}
            className="flex-1 px-3 py-2 border rounded-md text-sm"
          />
          <button
            type="submit"
            disabled={!username || !chatInput.trim()}
            className="bg-green-500 text-white px-3 py-2 rounded-md text-sm disabled:opacity-50"
          >
            Send
          </button>
        </form>

        {/* Success Modal */}
        {success && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl text-center px-6">
            <Image
              width={80}
              height={80}
              src={`/pets/${formatPetFilename(pet)}`}
              alt={pet}
              className="w-24 h-24 mb-2 animate-bounce"
            />
            <h2 className="text-xl font-bold text-green-700">✅ {pet} Sent!</h2>
            <p className="text-gray-600">{getRarity(pet)} Rarity</p>
            <p className="mt-2 text-gray-700">
              Your {pet} will appear in your Roblox mailbox in 24 hours!
            </p>

            {video && (
              <div className="mt-4 w-full text-sm text-gray-700 space-y-2">
                <p>
                  🔒 Please click and watch the video for 15 seconds to verify:
                </p>
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleStartProgress}
                  className="text-green-700 underline font-medium block text-center"
                >
                  {video.title}
                </a>

                {/* Progress Bar */}
                {progressStarted && (
                  <>
                    <div className="w-full h-3 bg-gray-200 rounded overflow-hidden mt-2">
                      <div
                        className="h-full bg-green-500 transition-all duration-1000"
                        style={{ width: `${((15 - timer) / 15) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-center text-gray-500">
                      {timer}s remaining...
                    </p>
                  </>
                )}
              </div>
            )}

            {timer <= 0 && (
              <button
                onClick={handleReset}
                className="mt-6 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Done
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
