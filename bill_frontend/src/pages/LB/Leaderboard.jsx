import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

function Leaderboard() {
  const { theme } = useAuth();
  const isDark = theme === "dark";
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8383/citizen/getAll"
        );
        const data = response.data;
        console.log(data);

        if (Array.isArray(data)) {
          const sorted = data.sort((a, b) => b.points - a.points);
          setPlayers(sorted);
          console.log(sorted);
        }
      } catch (error) {
        console.error("Error fetching players:", error);
      }
    };
    fetchPlayers();
  }, []);

  const getRankEmoji = (index) => {
    if (index === 0) return "🏆";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return index + 1;
  };

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
              <span className="text-lg font-bold w-6">
                {getRankEmoji(index)}
              </span>
              <div>
                <p className="font-semibold">{player.name}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{player.points || 0} pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leaderboard;
