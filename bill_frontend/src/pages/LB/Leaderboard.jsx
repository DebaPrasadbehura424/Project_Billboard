import React from "react";
import { useAuth } from "../../context/AuthContext";

function Leaderboard() {
  const { theme } = useAuth();
  const isDark = theme === "dark";

  const players = [
    {
      id: 1,
      name: "Alice Johnson",
      points: 1200,
      posts: 34,
      photo: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
      id: 2,
      name: "Bob Smith",
      points: 1100,
      posts: 28,
      photo: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
      id: 3,
      name: "Charlie Davis",
      points: 950,
      posts: 22,
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
    },
  ];

  return (
    <div
      className={`min-h-screen p-6 ${
        isDark ? "bg-[#181818] text-[#FAFAFA]" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="max-w-2xl mx-auto space-y-4">
        {players.map((player, index) => (
          <div
            key={player.id}
            className={`flex items-center justify-between p-4 rounded-2xl shadow ${
              isDark ? "bg-[#242424]" : "bg-white"
            }`}
          >
            <div className="flex items-center space-x-4">
              <span className="text-lg font-bold w-6">{index + 1}</span>
              <img
                src={player.photo}
                alt={player.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">{player.name}</p>
                <p className="text-sm opacity-75">Posts: {player.posts}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold">{player.points} pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
