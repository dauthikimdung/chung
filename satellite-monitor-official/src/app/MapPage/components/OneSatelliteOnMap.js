import { Circle } from '../../packages/core/adapters/leaflet-map';

import Polyline from 'react-leaflet-arrowheads';
import Marker from './MarkerView';
const OneSatelliteOnMap = ({ num, coordinate, name }) => {

    return (
        <>
            {
                coordinate.map((item, index) =>
                    <>
                        <Marker key={`marker ${num}-${index}`} index_list={num} index_coordinate={index} position={[item.lat, item.long]} detail={{...item, name: name}}/>
                        <Circle key={`circle ${num}-${index}`} center={[item.lat, item.long]} radius={item.radius ? item.radius : 50000} stroke={false} />
                    </>
                )
            }
            <Polyline
                key={Math.random()}
                positions={coordinate.map(item => [item.lat, item.long])}
                arrowheads={{ size: '20px', fill: true, frequency: 'allvertices' }}
            />
        </>
    );
};

export default OneSatelliteOnMap;
