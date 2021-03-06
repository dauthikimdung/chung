import './MapContent.css';

import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch, } from 'react-redux';

import { setPredictPoint, setCoordinateOfMarkers, setIsInside} from '../../Redux/Position';

import { Map, TileLayer } from '../../packages/core/adapters/leaflet-map';
import L from 'leaflet'
import SearchMap from './SearchControl';
import OneSatelliteOnMap from './OneSatelliteOnMap';
import MapSelectArea from './MapSelectArea';
import pointInPolygon from 'point-in-polygon'
import { message } from '../../packages/core/adapters/ant-design';
import MapStatistical from './MapStatistical'
import centerMarkerIcon from '../../Assets/Images/marker-icon-2x-red.png'
import centerMarkerShadowIcon from '../../Assets/Images/marker-shadow.png'

const MapContent = (props) => {

var icon = new L.Icon({
  iconUrl: centerMarkerIcon,
  shadowUrl: centerMarkerShadowIcon,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
    const mapRef = useRef();
    const dispatch = useDispatch();
    const [zoom, setZoom] = useState(10)
    const [polygon, setPolygon] = useState([])
    const [polygonDisplay, setPolygonDisplay] = useState([])
    const [checkIsInside, setCheckIsInside] = useState(false)
    const { center, listSatellite, indexPredictPoint, isInside, 
    interfaceMapActionState, coordinateOfMarkers } = useSelector(state => state.positionReducer);
    const defaultMarkers = [
        {id: 0, marker: L.marker([0, 0]), popup: ''},
        {id: 1, marker: L.marker([0, 0]), popup: ''},
        {id: 2, marker: L.marker([0, 0]), popup: ''},
        {id: 3, marker: L.marker([0, 0]), popup: ''},
        {id: 4, marker: L.marker([0, 0],{icon: icon}), popup: ''},
    ]
    const [markers, setMarkers] = useState(defaultMarkers)
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
    // X??c ?????nh a,b trong ???????ng th???ng y = ax + b ??i qua 2 ??i???m
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
        let point1 = {lat: parseFloat(coordinateOfMarkers[0].lat), lng: parseFloat(coordinateOfMarkers[0].lng)}
        let point2 = {lat: parseFloat(coordinateOfMarkers[1].lat), lng: parseFloat(coordinateOfMarkers[1].lng)}
        let point3 = {lat: parseFloat(coordinateOfMarkers[2].lat), lng: parseFloat(coordinateOfMarkers[2].lng)}
        let point4 = {lat: parseFloat(coordinateOfMarkers[3].lat), lng: parseFloat(coordinateOfMarkers[3].lng)}
        let line12 = straightLine(point1, point2) // t??m ???????ng th???ng ??i qua 2 ??i???m 1, 2
        let temp1 = (line12.a * point3.lng - point3.lat + line12.b)
        let temp2 = (line12.a * point4.lng - point4.lat + line12.b)
        let line13 = straightLine(point1, point3) // t??m ???????ng th???ng ??i qua 2 ??i???m 1, 2
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
    useEffect(() => {
        if (interfaceMapActionState) { // Chuy???n sang ch???c n??ng 1 ??i???m
            // X??a c??c ??i???m ???? ch???n trong ??a ??i???m
            let temp = [coordinateOfMarkers[0],{lat:'', lng:''},{lat:'', lng:''},{lat:'', lng:''},{lat:'', lng:''}]
            dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(temp))))
            temp.map( (item, idx) => {
                    var reverseidx = 4 - idx
                    var index = markers.findIndex(x=> x.id === reverseidx)
                    var m = markers[index].marker.setLatLng(item)
                    updateItem(reverseidx, ['popup','marker'], ['', m])
                } 
            )        
            setPolygonDisplay([])

        }
       

    }, [interfaceMapActionState])

    // Th???c thi khi CoordinateOfMarkers thay ?????i
    useEffect(() => {
        console.log('coordinateOfMarkers')
        let lat = coordinateOfMarkers[indexPredictPoint].lat
        let lng = coordinateOfMarkers[indexPredictPoint].lng
        if (lat !== '' && lng !== ''){
            // N???u ???? ch???n ????? 4 ??i???m
            if (coordinateOfMarkers[0].lat !== '' && coordinateOfMarkers[0].lng !== '' &&
                coordinateOfMarkers[1].lat !== '' && coordinateOfMarkers[1].lng !== '' &&
                coordinateOfMarkers[2].lat !== '' && coordinateOfMarkers[2].lng !== '' &&
                coordinateOfMarkers[3].lat !== '' && coordinateOfMarkers[3].lng !== '') {
                checkPolygon()
            }
            // N???u ??ang ch???n 1 trong 4 ?????nh ho???c ??i???m trung t??m n???m b??n trong khu v???c quan t??m
            let coordinateCurrentMarker = {lat: parseFloat(lat), lng: parseFloat(lng)}
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
    useEffect(() => {
        console.log('polygon:', polygon)
        dispatch(setIsInside(pointInPolygon([parseFloat(coordinateOfMarkers[4].lng),parseFloat(coordinateOfMarkers[4].lat)], polygon)))
        setCheckIsInside(!checkIsInside)
    }, [polygon])
    useEffect(() => {
        console.log('isInside:', isInside)
        if (!isInside && coordinateOfMarkers[4].lng !== '' && coordinateOfMarkers[4].lat !== '' ) {
            message.warning({
                content: 'Vui l??ng ch???n ??i???m Trung t??m b??n trong khu v???c 4 ?????nh ???? ch???n.',
                key: 'outSide',
                style: {
                // marginTop: '10vh',
                },
                duration: 1
            });
        }
    }, [checkIsInside])
    // Th???c thi khi marker thay ?????i
    useEffect(() => {
        console.log('Markers: ')
        const map = mapRef.current;
        if (map !== null) {
            map.leafletElement.locate();
            // N???u ??ang b???t ch???c n??ng ch???n nhi???u ??i???m
            if (!interfaceMapActionState) {
                markers.map((item, i) => {
                    if(item.id === indexPredictPoint && item.popup !== '') {
                        if (i !== 4)
                            item.marker.addTo(map.leafletElement).bindPopup('??i???m ' + (i + 1) + ': ' + item.popup).openPopup()
                        else if (isInside)
                            item.marker.addTo(map.leafletElement).bindPopup('??i???m trung t??m: ' + item.popup).openPopup()
                    }
                    else {
                        item.marker.addTo(map.leafletElement)
                    }
                });
                if (!isInside){
                    map.leafletElement.removeLayer(markers[4].marker)
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
        // N???u l?? 1 ??i???m
        if (interfaceMapActionState) {
            // dispatch(setPredictPoint([e.latlng.lat, e.latlng.lng]))
            let newCoor = JSON.parse(JSON.stringify(coordinateOfMarkers))
            newCoor[indexPredictPoint] = e.latlng
            dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(newCoor))))
        }
        else // N???u l?? nhi???u ??i???m
        {
            // N???u ??ang ch???n ??i???m trung t??m:
            if(indexPredictPoint === 4){
                if (!pointInPolygon([e.latlng.lng,e.latlng.lat], polygon)){ // N???u kh??ng n???m trong v??ng quan t??m
                    message.warning({
                        content: 'Vui l??ng ch???n ??i???m Trung t??m b??n trong khu v???c 4 ?????nh ???? ch???n.',
                        className: 'custom-class',
                        style: {
                        // marginTop: '10vh',
                        },
                        duration: 1.5
                    });
                    return // Tho??t s??? ki???n k??ch chu???t
                }
            }
            // C???p nh???t gi?? tr??? ??i???m click chu???t
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
                    listSatellite.map((item, index) => <OneSatelliteOnMap key={`satellite marker ${index}`} coordinate={item.coordinate} name={item.name} num={index}/>)
                }                
                <MapSelectArea polygonDisplay={polygonDisplay}/>
            </Map>            
            <MapStatistical />
        </div>

    );
}

export default MapContent;