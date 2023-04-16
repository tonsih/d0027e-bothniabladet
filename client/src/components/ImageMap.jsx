import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import L from 'leaflet';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

function ImageMap({ coordinates }) {
	const [coordString, setCoordString] = useState(coordinates);

	let DefaultIcon = L.icon({
		iconUrl: icon,
		shadowUrl: iconShadow,
	});
	L.Marker.prototype.options.icon = DefaultIcon;

	const convertCoordinates = coordString => {
		const [latStr, lonStr] = coordString.split(/[, ]+/);
		const lat = parseFloat(latStr.replace(/[^0-9.]/g, ''));
		const lon = parseFloat(lonStr.replace(/[^0-9.]/g, ''));
		const latitude = latStr.includes('S') ? -lat : lat;
		const longitude = lonStr.includes('W') ? -lon : lon;
		return { latitude, longitude };
	};
	console.log(coordinates);

	// Handle changes to the input field
	const handleInputChange = event => {
		setCoordString(event.target.value);
	};

	// Convert the coordinate string to decimal degrees
	const coords = convertCoordinates(coordString);

	if (isNaN(coords.latitude) || isNaN(coords.longitude)) {
		return <div>Invalid coordinates</div>;
	}

	// Render the map
	return (
		<div>
			<input type='text' value={coordString} readOnly />

			<MapContainer
				center={[coords.latitude, coords.longitude]}
				zoom={13}
				style={{ height: '400px' }}
			>
				<TileLayer
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
				/>
				<Marker position={[coords.latitude, coords.longitude]}>
					<Popup>
						Coordinates: {coords.latitude.toFixed(6)},{' '}
						{coords.longitude.toFixed(6)}
					</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
}

export default ImageMap;
