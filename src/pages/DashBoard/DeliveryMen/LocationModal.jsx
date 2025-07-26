/* eslint-disable react/prop-types */ // TODO: upgrade to latest eslint tooling

import { TileLayer, Marker, Popup, MapContainer } from "react-leaflet";
import L from "leaflet";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription, // Import DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const customIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

const LocationModal = ({ isOpen, onClose, latitude, longitude, address }) => {
  // useEffect(() => {
  //   console.log("Latitude:", latitude, "Longitude:", longitude);
  // }, [latitude, longitude]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogTitle>Delivery Location</DialogTitle>

        {/* 🔹 Add DialogDescription for accessibility */}
        <DialogDescription>
          This map shows the delivery location based on the provided
          coordinates.
        </DialogDescription>

        <div className="w-full h-[300px] rounded-lg overflow-hidden">
          <MapContainer
            center={[latitude, longitude]}
            zoom={15}
            className="h-full w-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} icon={customIcon}>
              <Popup>{address || "Delivery Location"}</Popup>
            </Marker>
          </MapContainer>
        </div>

        <Button onClick={onClose} className="mt-4 w-full">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default LocationModal;
