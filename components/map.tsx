import { MapPin } from "lucide-react";
import { FC } from "react";
import { Button } from "./ui/button";

interface MapLinkProps {
  lat: number;
  lng: number;
  text?: string;
}

const MapLink: FC<MapLinkProps> = ({ lat, lng, text }) => {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <Button asChild variant={"outline"}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {text || "See in google map"}
        <MapPin className="w-4 ml-4" />
      </a>
    </Button>
  );
};

export default MapLink;
