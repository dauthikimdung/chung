import './SatelliteSearch.css';

import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Input, AutoComplete  } from '../../packages/core/adapters/ant-design';
import { search_list_names, find_satellite_info } from '../../Redux/Position';

const SatelliteSearch = () => {
    const dispatch = useDispatch();
    const { listNameSatellites, satelliteSearchInfo } = useSelector(state => state.positionReducer);
    const [selectedID, setSelectedID] = useState(0)
    useEffect(() => {        
        setOptions(searchResult());
    }, [listNameSatellites])
    const searchResult = () =>
        listNameSatellites.listName.map((item, idx) => {
        return {
            value: item.id,
            label: (
                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    }}
                >
                    <strong>{item.id}</strong>
                    <span style={{
                        width: '520px',
                        'overflow-x': 'auto'
                    }}>{item.name}</span>
                </div>
            )
        };
    });
    

    const [options, setOptions] = useState([]);

    const handleSearch = (value) => {
        dispatch(search_list_names(value))
    };

    const onSelect = (value) => {
        dispatch(find_satellite_info(value));
    }
    return (
        <>
            <div className='search-satellite-wrapper'>
                <AutoComplete
                    dropdownMatchSelectWidth={400}
                    style={{ width: 600, height:50 }}
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    >
                    <Input.Search size="large" placeholder="Số NORAD hoặc Tên vệ tinh" 
                        style={{ width: '600px', height:'50px' }} enterButton 
                    />
                </AutoComplete>
                <h3><strong>Thông tin vệ tinh:</strong> {satelliteSearchInfo["Official Name"]}</h3>
                <table>
                    <tbody>
                        <tr>
                            <td colSpan="1"><strong>Số hiệu NORAD:</strong> {satelliteSearchInfo["NORAD Number"]}</td>
                            <td colSpan="2"><strong>Số hiệu phóng:</strong> {satelliteSearchInfo["COSPAR Number"]}</td>
                            <td colSpan="1"><strong>Quốc gia:</strong> {satelliteSearchInfo["Nation"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><strong>Nhà vận hành:</strong> {satelliteSearchInfo["Operator"]}</td>
                            <td colSpan="1"><strong>Ứng dụng:</strong> {satelliteSearchInfo["Application"]}</td> 
                            <td colSpan="1"><strong>Người dùng:</strong> {satelliteSearchInfo["Users"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><strong>Quỹ đạo:</strong> {satelliteSearchInfo["Orbit"]}</td>
                            <td colSpan="1"><strong>Lớp quỹ đạo:</strong> {satelliteSearchInfo["Class of Orbit"]}</td>                  
                            <td colSpan="1"><strong>Kiểu quỹ đạo:</strong> {satelliteSearchInfo["Type of Orbit"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="3"><strong>Mục đích cụ thể:</strong> {satelliteSearchInfo["Detailed Purpose"]}</td>
                            <td colSpan="1"><strong>Chu kỳ (phút):</strong> {satelliteSearchInfo["Period (minutes)"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="3"><strong>Trang bị:</strong> {satelliteSearchInfo["Equipment"]}</td>
                            <td colSpan="1"><strong>Khối lượng:</strong> {satelliteSearchInfo["Mass (kg)"]}</td>
                        </tr>
                        <tr>                        
                            <td colSpan="4"><strong>Mô tả:</strong> {satelliteSearchInfo["Describe"]}</td>
                        </tr>
                    </tbody>
                </table>
                <div><p></p></div>
            </div>
            
        </>
    )
}
export default SatelliteSearch;
