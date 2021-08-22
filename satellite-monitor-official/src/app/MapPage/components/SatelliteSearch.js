import './SatelliteSearch.css';

import React, { useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Button, Form, AutoComplete  } from '../../packages/core/adapters/ant-design';
import { SelectProps } from 'antd/es/select';
import { search_list_names, find_satellite_info } from '../../Redux/Position';

const SatelliteSearch = () => {
    const dispatch = useDispatch();
    const { listNameSatellites, satelliteSearchInfo } = useSelector(state => state.positionReducer);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {

    };

    useEffect(() => {        
        setOptions(searchResult());
    }, [listNameSatellites])
    const searchResult = () =>
        listNameSatellites.listName.map((item, idx) => {
        return {
            value: item.name,
            label: (
                <div
                    style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    }}
                >
                    <span>{item.name}</span>
                    <strong>{item.id}</strong>
                </div>
            )
        };
    });
    

    const [options, setOptions] = useState([]);

    const handleSearch = (value: string) => {
        dispatch(search_list_names(value))
    };

    const onSelect = (value: string) => {
        dispatch(find_satellite_info(value));
    }
    return (
        <>
            <div className='search-satellite-wrapper'>
                <AutoComplete
                    dropdownMatchSelectWidth={300}
                    style={{ width: 500, height:50 }}
                    options={options}
                    onSelect={onSelect}
                    onSearch={handleSearch}
                    >
                    <Input.Search size="large" placeholder="Số NORAD hoặc Tên vệ tinh" 
                        style={{ width: '500px', height:'50px' }} enterButton 
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
