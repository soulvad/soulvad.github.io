import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styled from 'styled-components';
import L from 'leaflet';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Tour {
  id: number;
  title: string;
  image?: string;
  duration?: string;
  price?: string;
  location: {
    lat: number;
    lng: number;
  };
  description?: string;
}

interface MapProps {
  tours: Tour[];
  onBook?: (id: number) => void;
  bookings?: number[];
}

const MapWrapper = styled.div`
  height: 400px;
  width: 100%;
  margin: 2rem 0;
  
  .leaflet-container {
    height: 100%;
    width: 100%;
  }
`;

const BookButton = styled.button`
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 15px;
  transition: background-color 0.3s;
  width: 100%;
  &:hover {
    background-color: #45a049;
  }
`;

const Map: React.FC<MapProps> = ({ tours, onBook, bookings }) => {
  const center: [number, number] = [49.8397, 24.0297]; // Lviv coordinates as default center

  return (
    <MapWrapper>
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {tours.map((tour) => (
          <Marker
            key={tour.id}
            position={[tour.location.lat, tour.location.lng]}
          >
            <Popup minWidth={300} maxWidth={350}>
              <div style={{ minWidth: 260 }}>
                <h3 style={{ marginTop: 0 }}>{tour.title}</h3>
                <div style={{ color: '#444', marginBottom: 8 }}>{tour.description}</div>
                {tour.duration && <div style={{ marginBottom: 4 }}>Тривалість: {tour.duration}</div>}
                {tour.price && <div style={{ marginBottom: 8 }}>Ціна: {tour.price}</div>}
                {onBook && bookings && !bookings.includes(tour.id) && (
                  <BookButton onClick={() => onBook(tour.id)}>
                    Забронювати
                  </BookButton>
                )}
                {onBook && bookings && bookings.includes(tour.id) && (
                  <div style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: 10 }}>Вже заброньовано</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </MapWrapper>
  );
};

export default Map; 