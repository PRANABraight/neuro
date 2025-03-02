// src/hooks/useIdsData.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export default function useIdsData() {
  const [predictionData, setPredictionData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Update sample features to match the expected number of features (82)
  const sampleFeatures = Array(82).fill(0).map((_, i) => i % 10 === 0 ? i / 10 : Math.random());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Prepare payload for the API
      const payload = {
        timestamp: new Date().toISOString(),
        source_ip: "192.168.1." + Math.floor(Math.random() * 255),
        destination_ip: "10.0.0." + Math.floor(Math.random() * 255),
        protocol: ["TCP", "UDP", "HTTP", "HTTPS"][Math.floor(Math.random() * 4)],
        features: sampleFeatures
      };

      // Send a POST request to the /detect endpoint
      const data = await api.detect(payload);

      setPredictionData(data);
      setHistoricalData(prev => {
        const newData = [...prev, { ...data, id: Date.now() }];
        return newData.slice(-10); // Keep only the last 10 entries
      });

      setError(null);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(typeof err === 'string' ? err : 'Failed to fetch data from API');
    } finally {
      setLoading(false);
    }
  }, [sampleFeatures]);

  // Poll every 10 seconds
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  return { predictionData, historicalData, loading, error, fetchData };
}
