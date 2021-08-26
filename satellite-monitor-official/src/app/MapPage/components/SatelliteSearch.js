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
                <h3><strong>Info of Satellite:</strong> {satelliteSearchInfo["Official Name"]}</h3>
                <table>
                    <tbody>
                        <tr>
                            <td colSpan="1"><strong>NORAD Number:</strong> {satelliteSearchInfo["NORAD Number"]}</td>
                            <td colSpan="2"><strong>COSPAR Number:</strong> {satelliteSearchInfo["COSPAR Number"]}</td>
                            <td colSpan="1"><strong>Nation:</strong> {satelliteSearchInfo["Nation"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><strong>Operator:</strong> {satelliteSearchInfo["Operator"]}</td>
                            <td colSpan="1"><strong>Application:</strong> {satelliteSearchInfo["Application"]}</td> 
                            <td colSpan="1"><strong>Users:</strong> {satelliteSearchInfo["Users"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="2"><strong>Orbit:</strong> {satelliteSearchInfo["Orbit"]}</td>
                            <td colSpan="1"><strong>Class of Orbit:</strong> {satelliteSearchInfo["Class of Orbit"]}</td>                  
                            <td colSpan="1"><strong>Type of Orbit:</strong> {satelliteSearchInfo["Type of Orbit"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="3"><strong>Detailed Purpose:</strong> {satelliteSearchInfo["Detailed Purpose"]}</td>
                            <td colSpan="1"><strong>Period:</strong> {satelliteSearchInfo["Period (minutes)"]}</td>
                        </tr>
                        <tr>
                            <td colSpan="3"><strong>Equipment:</strong> {satelliteSearchInfo["Equipment"]}</td>
                            <td colSpan="1"><strong>Mass:</strong> {satelliteSearchInfo["Mass (kg)"]}</td>
                        </tr>
                        <tr>                        
                            <td colSpan="4"><strong>Describe:</strong> {satelliteSearchInfo["Describe"]}</td>
                        </tr>
                    </tbody>
                </table>
                <div><p></p></div>
            </div>
            
        </>
    )
}
export default SatelliteSearch;
