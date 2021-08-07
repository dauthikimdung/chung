import { Popup, Marker } from '../../packages/core/adapters/leaflet-map'
import L from 'leaflet' // Thư viện truy vấn ngược Địa điểm theo Tọa độ
import satellite from '../../Assets/Images/icons8-satellite-30.png'
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSatellite, setListPosition } from '../../Redux/Position/PositionSlice';
import { getSatelliteInfo } from '../../Redux/Position';

const MarkerView = ({ index_list, index_coordinate, position, detail }) => {
    const geocoder = L.Control.Geocoder.nominatim();
    const dispatch = useDispatch();
    const {listSatellite} = useSelector(state => state.positionReducer)
    const satelliteIcon = new L.Icon({
        iconUrl: satellite,
        iconRetinaUrl: satellite,
        popupAnchor: [-0, -0],
        iconSize: [32, 32],
        //className: 'leaflet-div-icon'
    })
    const handleClick = async () => {
        dispatch(getSatelliteInfo(detail.id))
        var temp = JSON.parse(JSON.stringify(listSatellite[index_list].coordinate))
        // listSatellite[index_list].coordinate.map((item, ind) => {
        //     geocoder.reverse(
        //         {lat: item.lat, lng: item.long},
        //         256 * Math.pow(2, 18),
        //         async (results) => {
        //             var r = await results[0];
        //             if (r !== undefined){
        //                 temp[ind].location = r.name
        //                 dispatch(setListPosition(JSON.parse(JSON.stringify(temp))))
        //             }
        //             else 
        //             {
        //                 temp[ind].location = "Không xác định"
        //                 dispatch(setListPosition(JSON.parse(JSON.stringify(temp))))
        //             }
        //             dispatch(setCurrentSatellite(temp[index_coordinate]))
        //         }
        //     )
        // })
        dispatch(setListPosition(JSON.parse(JSON.stringify(temp))))
        dispatch(setCurrentSatellite(temp[index_coordinate]))
        // console.log(geocoder.reverse(position))
    }

    return (
        <Marker position={position} icon={satelliteIcon}>
            <Popup><strong>{detail.name}</strong> <br />({position[0].toFixed(6)}, {position[1].toFixed(6)}) <br/> <button onClick={handleClick}>Xem chi tiết</button></Popup>
        </Marker>
    )
}

export default MarkerView;
