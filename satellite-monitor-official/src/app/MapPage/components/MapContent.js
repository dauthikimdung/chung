import './MapContent.css';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';

import { setPredictPoint } from '../../Redux/Position';

import { Map, TileLayer } from '../../packages/core/adapters/leaflet-map';
import L from 'leaflet'
import SearchMap from './SearchControl';
import OneSatelliteOnMap from './OneSatelliteOnMap';

const MapContent = (props) => {
    
    const mapRef = useRef();
    const dispatch = useDispatch();
    const [zoom, setZoom] = useState(10)
    const { center, listSatellite } = useSelector(state => state.positionReducer);

    useEffect(() => {
        const map = mapRef.current;
        if (map !== null) {
            map.leafletElement.locate();
        }
    }, [])
    //const SearchBar = withLeaflet(SearchMap);
    const handleClick = (e) => {
        dispatch(setPredictPoint([e.latlng.lat, e.latlng.lng]));
    }

    return (
        <div className='map-content-wrapper'>
            <Map ref={mapRef} center={center} zoom={zoom} onclick={handleClick} onzoomend={() => setZoom(mapRef.current.leafletElement.getZoom())}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                />
                <SearchMap />                
                {
                    listSatellite.map((item, index) => <OneSatelliteOnMap key={index} coordinate={item.coordinate} name={item.name} num={index}/>)
                }
            </Map>
        </div>

    );
}

export default MapContent;