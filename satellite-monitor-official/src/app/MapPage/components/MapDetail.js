import './MapDetail.css';
import { useSelector } from 'react-redux';
import OneSateOfSatellite from './OneSateOfSatellite';
const MapDetail = () => {

    const { currentSatellite, listPosition } = useSelector(state => state.positionReducer)
    return (
        <div className='map-detail-wrapper'>
            <h3>Satellite: {currentSatellite.info["Official Name"]} - <strong>{currentSatellite.detail.trvn}</strong></h3>
            <h4>{currentSatellite.detail.location}</h4>
            <table>
                <tbody>
                    <tr>
                        <td colSpan="1"><strong>NORAD Number:</strong> {currentSatellite.detail.id}</td>
                        <td colSpan="1"><strong>COSPAR Number:</strong> {currentSatellite.info["COSPAR Number"]}</td>
                        <td colSpan="1"><strong>Vĩ độ:</strong> {currentSatellite.detail.lat != null ? currentSatellite.detail.lat.toFixed(6) : ""}</td>
                        <td colSpan="1"><strong>Kinh độ:</strong> {currentSatellite.detail.long != null ? currentSatellite.detail.long.toFixed(6) : ""}</td>

                    </tr>
                    <tr>
                        <td colSpan="3"><strong>Official Name:</strong> {currentSatellite.info["Official Name"]}</td>
                        <td colSpan="1"><strong>Nation:</strong> {currentSatellite.info["Nation"]}</td>
                    </tr>
                    <tr>
                    </tr>
                    <tr>                   
                        <td colSpan="1"><strong>Users:</strong> {currentSatellite.info["Users"]}</td>
                        <td colSpan="2"><strong>Application:</strong> {currentSatellite.info["Application"]}</td> 
                        <td colSpan="1"><strong>Operator:</strong> {currentSatellite.info["Operator"]}</td>
                    </tr>
                    <tr>                                                
                        <td colSpan="1"><strong>Elevation:</strong> {currentSatellite.detail.elevation}</td>
                        <td colSpan="1"><strong>Azim:</strong> {currentSatellite.detail.az != null ? currentSatellite.detail.az.toFixed(6) : ""}</td>
                        <td colSpan="1"><strong>Alt:</strong> {currentSatellite.detail.alt != null ? Number.parseFloat(currentSatellite.detail.alt).toExponential(4): ""}</td>
                        <td colSpan="1"><strong>Distance:</strong> {currentSatellite.detail.range}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Class of Orbit:</strong> {currentSatellite.info["Class of Orbit"]}</td>                  
                        <td colSpan="1"><strong>Type of Orbit:</strong> {currentSatellite.info["Type of Orbit"]}</td>
                        <td colSpan="2"><strong>Orbit:</strong> {currentSatellite.info["Orbit"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Detailed Purpose:</strong> {currentSatellite.info["Detailed Purpose"]}</td>
                        <td colSpan="1"><strong>Equipment:</strong> {currentSatellite.info["Equipment"]}</td>
                        <td colSpan="1"><strong>Period:</strong> {currentSatellite.info["Period (minutes)"]}</td>
                        <td colSpan="1"><strong>Mass:</strong> {currentSatellite.info["Mass (kg)"]}</td>
                    </tr>
                    <tr>                        
                        <td colSpan="4"><strong>Describe:</strong> {currentSatellite.info["Describe"]}</td>
                    </tr>
                    <tr>
                    </tr>
                </tbody>
            </table>
            <h3>{listPosition.length} Trạng thái gần nhất của vệ tinh {currentSatellite.detail.name}</h3>
            <table>
            <tbody>
            <tr>
                <td><strong>Thời gian</strong></td>          
                <td><strong>Elevation</strong></td>
                <td><strong>Azim</strong></td>
                <td><strong>Vĩ độ</strong></td>
                <td><strong>Kinh độ</strong></td>
                <td><strong>Alt</strong></td>
                <td><strong>Distance</strong></td>
                <td><strong>Location</strong></td>
            </tr>
            {
                listPosition.length !== 0 ?
                listPosition.map((item, index) => <OneSateOfSatellite key={`sate ${index} satellite ${currentSatellite.detail.id} `} item={item} />)
                :
                <>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                    <tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                </>
            }
            </tbody>
            </table>
            <div><p></p></div>
        </div>
    )
}

export default MapDetail;