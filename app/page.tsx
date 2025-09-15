'use client'

import { WebApp } from "@twa-dev/types";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}


export default function Home () {

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState< string | null>(null);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    if(typeof window !== undefined && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const initData = tg.initData || '';
      const initDataUnsafe = tg.initDataUnsafe || {}

      if(initDataUnsafe.user) {
        fetch('api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(initDataUnsafe.user) 
        })
        .then((res)=> res.json())
        .then((data) => {
          if(data.error){
            setError(data);
          }

          setUser(data);
        })
        .catch((err) => {
          setError('Failed fetch user')
        })
      } else {
        setError('No userdata avaliable');
      }
    } else {
      setError(' This App should be only opened telegram');
    }
  }, []);

  const handleIncreasePoints = async () => {
    if(!user) {
      return
    }

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type':'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId}),
      });

      const data = await res.json();

      if(data.success) {
        setUser({...user, points: data.points});
        setNotification('Points Icreased successfuly');
        setTimeout(() => setNotification(''), 3000);
      } else {
        setError('Failed to increase points');
      }

    } catch (error) {
      setError('An error ocurres while increase points')
    }
  }

  if(error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if(!user) {
    return <div className="container mx-auto p-4">Loading...</div>
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-4x1 font-bold mb-8">Telegram channel membership check {user}</h1>
      
      <button
        onClick={handleIncreasePoints}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Incresed points
      </button>
      {notification && (
        <div className="mt-4 p-2 bg-green-100 text-green-800 rounded shadow">
          {notification}
        </div>
      )}
    </main>
  )
}