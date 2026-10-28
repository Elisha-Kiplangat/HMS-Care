import { useEffect, useState } from 'react';
import { useCallStore } from '../store/callStore';

export const useNetworkQuality = () => {
  const { networkQuality, setNetworkQuality } = useCallStore();
  const [ping, setPing] = useState<number>(50);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate ping monitoring / RTT quality check
      const mockPing = Math.floor(Math.random() * 150) + 20;
      setPing(mockPing);
      if (mockPing < 80) setNetworkQuality('good');
      else if (mockPing < 150) setNetworkQuality('fair');
      else setNetworkQuality('poor');
    }, 5000);

    return () => clearInterval(interval);
  }, [setNetworkQuality]);

  return { networkQuality, ping };
};
