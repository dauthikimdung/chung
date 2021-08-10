import './MapContent.css';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';

import { setPredictPoint, setCoordinateOfMarkers} from '../../Redux/Position';

import { Map, TileLayer } from '../../packages/core/adapters/leaflet-map';
import L from 'leaflet'
import SearchMap from './SearchControl';
import OneSatelliteOnMap from './OneSatelliteOnMap';
import MapSelectArea from './MapSelectArea';
import pointInPolygon from 'point-in-polygon'
import { message } from '../../packages/core/adapters/ant-design';
const MapContent = (props) => {
    
    const mapRef = useRef();
    const dispatch = useDispatch();
    const [zoom, setZoom] = useState(10)
    const [polygon, setPolygon] = useState([])
    const [isInside, setIsInside] = useState(false)
    const { center, listSatellite, indexPredictPoint, 
    interfaceMapActionState, coordinateOfMarkers } = useSelector(state => state.positionReducer);    
    const [markers, setMarkers] = useState([
        {id: 0, coordinate: {lat:0, lng:0}, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 1, coordinate: {lat:0, lng:0}, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 2, coordinate: {lat:0, lng:0}, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 3, coordinate: {lat:0, lng:0}, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 4, coordinate: {lat:0, lng:0}, marker: L.marker({lat:0, lng:0}), popup: ''},
    ])
    const updateItem =(id, whichvalue, newvalue) => {
        var index = markers.findIndex(x=> x.id === id);
        if (index === -1){
            // handle error
            console.log('no match')
        }
        let g = markers[index]
        whichvalue.map((key,index) => {
            g[key] = newvalue[index]            
        })
        setMarkers([
            ...markers.slice(0,index),
            g,
            ...markers.slice(index+1)
            ]
        );
        console.log("updated: ",whichvalue)
    }
    // Xác định a,b trong đường thẳng y = ax + b đi qua 2 điểm
    const straightLine = (point1, point2) => {
        if(point1.lat === point2.lat) // y1=y2
        {
            return {a: 0, b: 1}
        }
        else if (point1.lng === point2.lng){ // x1=x2
            return {a: 1, b: 0}
        }
        else { // x1 != x2; y1 != y2
            let a = (point1.lat-point2.lat)/(point1.lng-point2.lng)
            let b = (point1.lng*point2.lat-point2.lng*point1.lat)/(point1.lng-point2.lng)
            return {a: a, b: b}
        }        
    }
    
    const checkPolygon = () =>{
        let point1 = markers[0].coordinate
        let point2 = markers[1].coordinate
        let point3 = markers[2].coordinate
        let point4 = markers[3].coordinate
        let line12 = straightLine(point1, point2) // tìm đường thẳng đi qua 2 điểm 1, 2
        let temp1 = (line12.a * point3.lng - point3.lat + line12.b)
        let temp2 = (line12.a * point4.lng - point4.lat + line12.b)
        let line13 = straightLine(point1, point3) // tìm đường thẳng đi qua 2 điểm 1, 2
        let temp3 = (line13.a * point4.lng - point4.lat + line13.b)
        let temp4 = (line13.a * point2.lng - point2.lat + line13.b)
        let temp = []
        if (temp1 * temp2 > 0){
            if (temp3 * temp4 > 0){
                setPolygon([[point1.lng,point1.lat],[point2.lng,point2.lat],
                [point4.lng,point4.lat], [point3.lng,point3.lat]])
                temp = [point1, point2, point4, point3, point1]
            }
            else
            {
                temp = [point1, point2, point3, point4, point1]
                setPolygon([[point1.lng,point1.lat], [point2.lng,point2.lat],
                [point3.lng,point3.lat], [point4.lng,point4.lat]])
            }
        }           
        else
        {
            temp = [point1, point3, point2, point4, point1]
            setPolygon([[point1.lng,point1.lat], [point3.lng,point3.lat],
            [point2.lng,point2.lat], [point4.lng,point4.lat]])
        }
        dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(temp))))
    }
    const geocoder = L.Control.Geocoder.nominatim();

    useEffect(() => {
        const map = mapRef.current;
        if (map !== null) {
            map.leafletElement.locate();
            // console.log(interfaceMapActionState)
            if (!interfaceMapActionState) {
                markers.map((item, i) => {
                    if(item.id === indexPredictPoint && item.popup !== '') {
                        if (i !== 4)
                            item.marker.addTo(map.leafletElement).bindPopup('Điểm ' + (i + 1) + ': ' + item.popup).openPopup()
                        else if (pointInPolygon([markers[4].coordinate.lng,markers[4].coordinate.lat], polygon))
                            item.marker.addTo(map.leafletElement).bindPopup('Điểm trung tâm: ' + item.popup).openPopup()
                    }
                    else {
                        item.marker.addTo(map.leafletElement)
                    }
                        
                });
                if (!pointInPolygon([markers[4].coordinate.lng,markers[4].coordinate.lat], polygon)){
                    map.leafletElement.removeLayer(markers[4].marker)
                    if (indexPredictPoint !== 4 && markers[4].coordinate.lng !== 0 && markers[4].coordinate.lat !== 0 ) {
                        message.warning({
                            content: 'Vui lòng chọn lại điểm Trung tâm bên trong khu vực 4 đỉnh đã chọn.',
                            key: 'outSide',
                            style: {
                            // marginTop: '10vh',
                            },
                            duration: 1
                        });
                    }
                }
                setIsInside(pointInPolygon([markers[4].coordinate.lng,markers[4].coordinate.lat], polygon))
            }
            else {
                markers[0].marker.addTo(map.leafletElement).bindPopup(markers[0].popup)
                if(markers[0].popup !== '')
                    markers[0].marker.openPopup()
                markers.map((item, i) => {
                    if(i !== 0)
                        map.leafletElement.removeLayer(item.marker)
                });                
            }
            
        }
    }, [markers, coordinateOfMarkers])
    //const SearchBar = withLeaflet(SearchMap);


    const handleClick = (e) => {
        // Nếu là 1 điểm
        if (interfaceMapActionState) {
            // dispatch(setPredictPoint([e.latlng.lat, e.latlng.lng]))
            let newCoor = JSON.parse(JSON.stringify(coordinateOfMarkers))
            newCoor[indexPredictPoint] = e.latlng
            dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(newCoor))))
            updateItem(indexPredictPoint, ['coordinate'],[e.latlng])
            geocoder.reverse(
                e.latlng,
                256 * Math.pow(2, 16),
                async (results) => {
                    var r = await results[0];
                    if (r) {       
                        var index = markers.findIndex(x=> x.id === indexPredictPoint)
                        var m = markers[index].marker.setLatLng(e.latlng)
                        updateItem(indexPredictPoint, ['popup','marker'], [r.html || r.name, m])
                    }                    
                }
            );
        }
        else // Nếu là nhiều điểm
        {
            // Nếu đang chọn điểm trung tâm:
            if(indexPredictPoint === 4){                
                // console.log(pointInPolygon([e.latlng.lng,e.latlng.lat], polygon))
                if (!pointInPolygon([e.latlng.lng,e.latlng.lat], polygon)){
                    message.warning({
                        content: 'Vui lòng chọn điểm Trung tâm bên trong khu vực 4 đỉnh đã chọn.',
                        className: 'custom-class',
                        style: {
                        // marginTop: '10vh',
                        },
                        duration: 1.5
                    });
                    return
                }                    
            }
            if(indexPredictPoint != 4) {
                let newCoor = JSON.parse(JSON.stringify(coordinateOfMarkers))
                newCoor[indexPredictPoint] = e.latlng
                dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(newCoor))))
            }
            updateItem(indexPredictPoint, ['coordinate'],[e.latlng])
            if (markers[0].coordinate.lat !== 0 && markers[0].coordinate.lng !== 0 &&
                markers[1].coordinate.lat !== 0 && markers[1].coordinate.lng !== 0 &&
                markers[2].coordinate.lat !== 0 && markers[2].coordinate.lng !== 0 &&
                markers[3].coordinate.lat !== 0 && markers[3].coordinate.lng !== 0) {
                checkPolygon()
            }
            // Nếu đang chọn 1 trong 4 đỉnh hoặc điểm trung tâm nằm bên trong khu vực quan tâm
            geocoder.reverse(
                e.latlng,
                256 * Math.pow(2, 16),
                async (results) => {
                    var r = await results[0];
                    if (r) {       
                        var index = markers.findIndex(x=> x.id === indexPredictPoint)
                        var m = markers[index].marker.setLatLng(e.latlng)
                        updateItem(indexPredictPoint, ['popup','marker'], [r.html || r.name,m])
                    }
                }
            );
        }            
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
                <MapSelectArea />
            </Map>
        </div>

    );
}

export default MapContent;