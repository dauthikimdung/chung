import './MapDetail.css';
import { useSelector } from 'react-redux';
import OneSateOfSatellite from './OneSateOfSatellite';
const MapDetail = () => {

    const { currentSatellite, listPosition } = useSelector(state => state.positionReducer)
    return (
        <div className='map-detail-wrapper'>
            <h3>Vệ tinh: {currentSatellite.info["Official Name"]} - <strong>{currentSatellite.detail.trvn}</strong></h3>
            <h4>{currentSatellite.detail.location}</h4>
            <table>
                <tbody>
                    <tr>
                        <td colSpan="1"><strong>Số hiệu Norad:</strong> {currentSatellite.detail.id}</td>
                        <td colSpan="1"><strong>Số hiệu phóng:</strong> {currentSatellite.info["COSPAR Number"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Vĩ tuyến(º):</strong> {currentSatellite.detail.lat != null ? currentSatellite.detail.lat.toFixed(6) : ""}</td>
                        <td colSpan="1"><strong>Kinh tuyến(º):</strong> {currentSatellite.detail.long != null ? currentSatellite.detail.long.toFixed(6) : ""}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Tên chính thức:</strong> {currentSatellite.info["Official Name"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Quốc gia:</strong> {currentSatellite.info["Nation"]}</td>
                        <td colSpan="1"><strong>Người dùng:</strong> {currentSatellite.info["Users"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Ngày phóng:</strong> {currentSatellite.info["Date of Launch"]}</td>
                        <td colSpan="1"><strong>Nhà vận hành:</strong> {currentSatellite.info["Operator"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Ứng dụng:</strong> {currentSatellite.info["Application"]}</td> 
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Góc ngẩng(º) :</strong> {currentSatellite.detail.alt != null ? Number.parseFloat(currentSatellite.detail.alt.toFixed(6)): ""}</td>
                        <td colSpan="1"><strong>Phương vị(º):</strong> {currentSatellite.detail.az != null ? currentSatellite.detail.az.toFixed(6) : ""}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Độ cao(km):</strong> {currentSatellite.detail.elevation}</td>
                        <td colSpan="1"><strong>Khoảng cách(km):</strong> {currentSatellite.detail.range}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Quỹ đạo (cận điểm * viễn điểm, góc nghiêng):</strong> {currentSatellite.info["Orbit"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Lớp quỹ đạo:</strong> {currentSatellite.info["Class of Orbit"]}</td>                  
                        <td colSpan="1"><strong>Kiểu quỹ đạo:</strong> {currentSatellite.info["Type of Orbit"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="1"><strong>Chu kỳ (phút):</strong> {currentSatellite.info["Period (minutes)"]}</td>
                        <td colSpan="1"><strong>Khối lượng (kg):</strong> {currentSatellite.info["Mass (kg)"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Mục đích cụ thể:</strong> {currentSatellite.info["Detailed Purpose"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Trang bị:</strong> {currentSatellite.info["Equipment"]}</td>
                    </tr>
                    <tr>
                        <td colSpan="2"><strong>Mô tả:</strong> {currentSatellite.info["Describe"]}</td>
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
                <td><strong>Góc ngẩng(º)</strong></td>
                <td><strong>Phương vị(º)</strong></td>
                <td><strong>Vĩ tuyến(º)</strong></td>
                <td><strong>Kinh tuyến(º) </strong></td>
                <td><strong>Độ cao(km)</strong></td>
                <td><strong>Khoảng cách(km)</strong></td>
                <td><strong>Địa điểm</strong></td>
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