// Leaderboard.tsx

import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { collection, QuerySnapshot, getDocs, DocumentData } from 'firebase/firestore'; // Import Firestore functions

interface LeaderboardUser {
  uid: string;
  bestTime: number;
  email: string; // Add the email property
  highScore: number;
}

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const leaderboardRef = collection(db, 'users');
        const leaderboardSnapshot: QuerySnapshot<DocumentData> = await getDocs(leaderboardRef);
    
        const leaderboardData: LeaderboardUser[] = [];
    
        leaderboardSnapshot.forEach((doc) => {
          const userData = doc.data();
          leaderboardData.push({
            uid: doc.id,
            bestTime: userData.bestTime || 0,
            email: userData.email || '', // Get the email,
            highScore: userData.highScore || 0
          });
        });
    
        // Sort the data based on bestTime and ensure users with bestTime 0 are at the bottom
        leaderboardData.sort((a, b) => {
          if (a.bestTime === 0 && b.bestTime === 0) {
            // If both have not played, maintain their order
            return 0;
          } else if (a.bestTime === 0) {
            // Users who haven't played are at the bottom
            return 1;
          } else if (b.bestTime === 0) {
            // Users who haven't played are at the bottom
            return -1;
          } else {
            // Sort other users based on bestTime (ascending)
            return a.bestTime - b.bestTime;
          }
        });
    
        setLeaderboardData(leaderboardData);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }    
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className='leaderboard'>
      <div className='game-content'>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>User</th>
            <th>Best Time</th>
            <th>High Score</th>
          </tr>
        </thead>
        <tbody>
        {leaderboardData.map((user, index) => (
          <tr key={user.uid}>
            <td>{index + 1}</td>
            <td>{user.email}</td>
            <td>{user.bestTime} seconds</td>
            <td>{user.highScore}</td>
          </tr>
        ))}

        </tbody>
      </table>
      </div>
    </div>
  );
}

export default Leaderboard;
