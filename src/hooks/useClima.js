import { useEffect, useState } from "react";

const CODIGOS_CLIMA = {
  0: { desc: "Despejado", icon: "☀️" },
  1: { desc: "Mayormente despejado", icon: "🌤️" },
  2: { desc: "Parcialmente nublado", icon: "⛅" },
  3: { desc: "Nublado", icon: "☁️" },
  45: { desc: "Niebla", icon: "🌫️" },
  48: { desc: "Niebla helada", icon: "🌫️" },
  51: { desc: "Llovizna débil", icon: "🌦️" },
  53: { desc: "Llovizna", icon: "🌦️" },
  55: { desc: "Llovizna intensa", icon: "🌦️" },
  61: { desc: "Lluvia débil", icon: "🌧️" },
  63: { desc: "Lluvia", icon: "🌧️" },
  65: { desc: "Lluvia intensa", icon: "🌧️" },
  71: { desc: "Nieve", icon: "🌨️" },
  80: { desc: "Chubascos", icon: "🌦️" },
  81: { desc: "Chubascos fuertes", icon: "🌦️" },
  82: { desc: "Chubascos intensos", icon: "⛈️" },
  95: { desc: "Tormenta", icon: "⛈️" },
  96: { desc: "Tormenta con granizo", icon: "⛈️" },
  99: { desc: "Tormenta con granizo intensa", icon: "⛈️" },
};

function interpretarClima(code) {
  return CODIGOS_CLIMA[code] ?? { desc: "—", icon: "🌡️" };
}

export function useClima({ lat, lon }) {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lat == null || lon == null) return;

    let active = true;
    setLoading(true);
    setError(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=America%2FArgentina%2FBuenos_Aires`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Open-Meteo respondió ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (!active) return;
        setClima({
          temperatura: data.current?.temperature_2m,
          ...interpretarClima(data.current?.weather_code),
        });
      })
      .catch((err) => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [lat, lon]);

  return { clima, loading, error };
}