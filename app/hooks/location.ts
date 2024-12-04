import { useEffect, useState } from "react";

const useCurrentLocation = () => {
  const [location, setLocation] = useState({
    coordinates: { lat: 0, lng: 0 },
  });

  const onSuccess = (location: {
    coords: { latitude: number; longitude: number };
  }) => {
    setLocation({
      coordinates: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  const onError = (error: { code: number; message: string }) => {
    setLocation((pre) => ({
      ...pre,
      error: error.message,
    }));
  };

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      onError({
        code: 0,
        message: "Geolocation not supported",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  };

  useEffect(() => {
    requestLocation();
  }, []);

  return { location, requestLocation };
};

export default useCurrentLocation;
