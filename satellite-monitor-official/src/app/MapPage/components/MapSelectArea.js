import './MapContent.css';
import Polyline from 'react-leaflet-arrowheads';

const MapSelectArea = (props) => {
    return (
        <Polyline
            key={Math.random()}
            positions={props.coordinate.map(item => [item.lat, item.lng])}
            // arrowheads={{ size: '20px', fill: true, frequency: 'allvertices' }}
        />
    );
}

export default MapSelectArea;
// const powValueLine = (point1, point2) => {
    //     return (point1.lng-point2.lng)*(point1.lng-point2.lng) + (point1.lat-point2.lat)*(point1.lat-point2.lat)
    // }
        // if (temp1 === 0 && temp2 ===0){ // nếu 4 điểm nằm trên 1 đường thẳng thì điểm trung tâm nằm trên đường thẳng là được
        //     if(line.a * center.lng - center.lat + line.b) return true
        // }
        // if (temp1 === 0 && temp2 !==0) { // nếu điểm point3 nằm trên đường thẳng
        //     let AB = powValueLine(point1, point2)
        //     let BC = powValueLine(point2, point3)
        //     let AC = powValueLine(point3, point1)
        //     if (AB === Math.max(AB, BC, AC))
        //     return 
        // }