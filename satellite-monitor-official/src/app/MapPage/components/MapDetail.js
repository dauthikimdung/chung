import './MapDetail.css';
import { useSelector } from 'react-redux';
import OneSateOfSatellite from './OneSateOfSatellite';
const MapDetail = () => {

    const { currentSatellite, listPosition } = useSelector(state => state.positionReducer)

    console.log('current: ', currentSatellite);
    return (
        <div className='map-detail-wrapper'>
            <h3>Satellite: {currentSatellite.detail.name} - <strong>{currentSatellite.detail.trvn}</strong></h3>
            <h4>{currentSatellite.detail.location}</h4>
            <table>
                <tbody>
                    <tr>
                        <td colSpan="2"><strong>NORAD Number:</strong></td>
                        <td>{currentSatellite.detail.id}</td>
                        <td colSpan="1"><strong>Vĩ độ:</strong></td>
                        <td>{currentSatellite.detail.lat != null ? currentSatellite.detail.lat.toFixed(6) : ""}</td>
                        <td colSpan="1"><strong>Kinh độ:</strong></td>
                        <td>{currentSatellite.detail.long != null ? currentSatellite.detail.long.toFixed(6) : ""}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>COSPAR Number:</strong></td>
                        <td colSpan="2">{currentSatellite.info["COSPAR Number"]}</td>
                        <td colSpan="2"><strong>Official Name:</strong></td>
                        <td colSpan="3">{currentSatellite.info["Official Name"]}</td>
                        {/* <td><strong>Thời gian:</strong></td>
                        <td>{currentSatellite.detail.trvn}</td> */}
                    </tr>
                    <tr>                                                
                        <td><strong>Elevation:</strong></td>
                        <td>{currentSatellite.detail.elevation}</td>
                        <td><strong>Azim:</strong></td>
                        <td>{currentSatellite.detail.az != null ? currentSatellite.detail.az.toFixed(6) : ""}</td>
                        <td><strong>Alt:</strong></td>
                        <td>{currentSatellite.detail.alt != null ? Number.parseFloat(currentSatellite.detail.alt).toExponential(4): ""}</td>
                        <td><strong>Distance:</strong></td>
                        <td>{currentSatellite.detail.range}</td>
                        <td></td>
                    </tr>
                    <tr>                    
                        <td><strong>Users:</strong></td>
                        <td colSpan="2">{currentSatellite.info["Users"]}</td>
                        <td><strong>Nation:</strong></td>
                        <td>{currentSatellite.info["Nation"]}</td>
                        <td><strong>Operator:</strong></td>
                        <td colSpan="3">{currentSatellite.info["Operator"]}</td>
                    </tr>
                    <tr>
                        <td><strong>Application:</strong></td>
                        <td colSpan="4">{currentSatellite.info["Application"]}</td>
                        <td colSpan="2"><strong>Detailed Purpose:</strong></td>
                        <td colSpan="2">{currentSatellite.info["Detailed Purpose"]}</td>
                    </tr>             
                    <tr>
                        
                        <td ><strong>Orbit:</strong></td>
                        <td colSpan="3">{currentSatellite.info["Orbit"]}</td>
                        <td ><strong>Class of Orbit:</strong></td>
                        <td>{currentSatellite.info["Class of Orbit"]}</td>                        
                        <td><strong>Type of Orbit:</strong></td>
                        <td colSpan="2">{currentSatellite.info["Type of Orbit"]}</td>
                    </tr>       
                    <tr>
                        <td><strong>Equipment:</strong></td>
                        <td colSpan="2">{currentSatellite.info["Equipment"]}</td>
                        <td colSpan="2"><strong>Period (minutes):</strong></td>
                        <td>{currentSatellite.info["Period (minutes)"]}</td>
                        <td colSpan="2"><strong>Mass (kg):</strong></td>
                        <td>{currentSatellite.info["Mass (kg)"]}</td>
                    </tr>
                    <tr>                        
                        <td ><strong>Describe:</strong></td>
                        <td colSpan="8">{currentSatellite.info["Describe"]}</td>
                    </tr>
                    <tr>
                    </tr>
                </tbody>
            </table>
            <h3>5 Trạng thái gần nhất của vệ tinh {currentSatellite.detail.name}</h3>
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
                listPosition.length != 0 ?
                listPosition.map((item, index) => <OneSateOfSatellite item={item} />)
                :
                <>
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