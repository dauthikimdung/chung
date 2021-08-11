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
    const [polygonDisplay, setPolygonDisplay] = useState([])
    const [isInside, setIsInside] = useState(false)
    const { center, listSatellite, indexPredictPoint, 
    interfaceMapActionState, coordinateOfMarkers } = useSelector(state => state.positionReducer);
    const [markers, setMarkers] = useState([
        {id: 0, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 1, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 2, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 3, marker: L.marker({lat:0, lng:0}), popup: ''},
        {id: 4, marker: L.marker({lat:0, lng:0}), popup: ''},
    ])
    const geocoder = L.Control.Geocoder.nominatim();

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
        let point1 = coordinateOfMarkers[0]
        let point2 = coordinateOfMarkers[1]
        let point3 = coordinateOfMarkers[2]
        let point4 = coordinateOfMarkers[3]
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
                temp = [point1, point2, point4, point3]
            }
            else
            {
                temp = [point1, point2, point3, point4]
                setPolygon([[point1.lng,point1.lat], [point2.lng,point2.lat],
                [point3.lng,point3.lat], [point4.lng,point4.lat]])
            }
        }           
        else
        {
            temp = [point1, point3, point2, point4]
            setPolygon([[point1.lng,point1.lat], [point3.lng,point3.lat],
            [point2.lng,point2.lat], [point4.lng,point4.lat]])
        }
        setPolygonDisplay(temp)
    }
    // Thực thi khi CoordinateOfMarkers thay đổi
    useEffect(() => {
        console.log('a: ', coordinateOfMarkers, polygon,pointInPolygon([coordinateOfMarkers[4].lng,coordinateOfMarkers[4].lat], polygon))
        let lat = coordinateOfMarkers[indexPredictPoint].lat
        let lng = coordinateOfMarkers[indexPredictPoint].lng
        if (lat !== '' && lng != ''){
            // Nếu đã chọn đủ 4 điểm
            if (coordinateOfMarkers[0].lat !== '' && coordinateOfMarkers[0].lng !== '' &&
                coordinateOfMarkers[1].lat !== '' && coordinateOfMarkers[1].lng !== '' &&
                coordinateOfMarkers[2].lat !== '' && coordinateOfMarkers[2].lng !== '' &&
                coordinateOfMarkers[3].lat !== '' && coordinateOfMarkers[3].lng !== '') {
                checkPolygon()
            }
            // Nếu đang chọn 1 trong 4 đỉnh hoặc điểm trung tâm nằm bên trong khu vực quan tâm
            let coordinateCurrentMarker = {lat: lat, lng: lng}
            geocoder.reverse(
                coordinateCurrentMarker,
                256 * Math.pow(2, 18),
                async (results) => {
                    var r = await results[0];
                    if (r) {
                        var index = markers.findIndex(x=> x.id === indexPredictPoint)
                        var m = markers[index].marker.setLatLng(coordinateCurrentMarker)
                        updateItem(indexPredictPoint, ['popup','marker'], [r.html || r.name, m])
                    }
                }
            );
        }
    }, [coordinateOfMarkers])
    // Thực thi khi marker thay đổi
    useEffect(() => {        
        setIsInside(pointInPolygon([coordinateOfMarkers[4].lng,coordinateOfMarkers[4].lat], polygon))
        let tempisInside = pointInPolygon([coordinateOfMarkers[4].lng,coordinateOfMarkers[4].lat], polygon)
        console.log('b')
        const map = mapRef.current;
        if (map !== null) {
            map.leafletElement.locate();
            // Nếu đang bật chức năng chọn nhiều điểm
            if (!interfaceMapActionState) {
                markers.map((item, i) => {
                    if(item.id === indexPredictPoint && item.popup !== '') {
                        if (i !== 4)
                            item.marker.addTo(map.leafletElement).bindPopup('Điểm ' + (i + 1) + ': ' + item.popup).openPopup()
                        else if (tempisInside)
                            item.marker.addTo(map.leafletElement).bindPopup('Điểm trung tâm: ' + item.popup).openPopup()
                    }
                    else {
                        item.marker.addTo(map.leafletElement)
                    }
                });
                if (!tempisInside){
                    map.leafletElement.removeLayer(markers[4].marker)
                    if (indexPredictPoint !== 4 && coordinateOfMarkers[4].lng !== '' && coordinateOfMarkers[4].lat !== '' ) {
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
    }, [markers])
    //const SearchBar = withLeaflet(SearchMap);
    const handleClick = (e) => {
        // Nếu là 1 điểm
        if (interfaceMapActionState) {
            // dispatch(setPredictPoint([e.latlng.lat, e.latlng.lng]))
            let newCoor = JSON.parse(JSON.stringify(coordinateOfMarkers))
            newCoor[indexPredictPoint] = e.latlng
            dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(newCoor))))
        }
        else // Nếu là nhiều điểm
        {
            // Nếu đang chọn điểm trung tâm:
            if(indexPredictPoint === 4){
                if (!pointInPolygon([e.latlng.lng,e.latlng.lat], polygon)){ // Nếu không nằm trong vùng quan tâm
                    message.warning({
                        content: 'Vui lòng chọn điểm Trung tâm bên trong khu vực 4 đỉnh đã chọn.',
                        className: 'custom-class',
                        style: {
                        // marginTop: '10vh',
                        },
                        duration: 1.5
                    });
                    setIsInside(false)
                    return // Thoát sự kiện kích chuột
                }
            }
            // Cập nhật giá trị điểm click chuột
            let newCoor = JSON.parse(JSON.stringify(coordinateOfMarkers))
            newCoor[indexPredictPoint] = e.latlng
            dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(newCoor))))
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
                <MapSelectArea polygonDisplay={polygonDisplay}/>
            </Map>
        </div>

    );
}

export default MapContent;