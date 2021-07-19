import './MapActions.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DatePicker, Input, Button, Form } from '../../packages/core/adapters/ant-design';

import { setCenter, setListPolyline, calculate_orbit } from '../../Redux/Position';

import axios from 'axios';

import moment from 'moment';


const MapActions = () => {

    const dispatch = useDispatch();
    const { center } = useSelector(state => state.positionReducer);

    const [position, setPosition] = useState({ lat: '', lng: '' });
    const [listSatellite, setListSatellite] = useState([]);
    const [rangeTime, setRangeTime] = useState([]);


    const handleMove = () => {

        if (position.lat === '' || position.lng === '')
            return;

        let arr = [];
        arr.push(Number(position.lat));
        arr.push(Number(position.lng));

        dispatch(setCenter(arr));
    }

    const handleOnChange = (value, dateString) => {
        console.log(value);
    }

    const handleOnChangeRange = (value, dateString) => {
        if (value !== null && moment() < moment(value[0])) {
            const start_time = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            const end_time = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
            setRangeTime([start_time, end_time])
        }

    }

    const handleGetData = async () => {

        let a = {
            lat: center[0],
            long: center[1],
            time_start: rangeTime[0] ? rangeTime[0] : '',
            time_end: rangeTime[1] ? rangeTime[1] : ''
        }

        console.log(a);

        dispatch(calculate_orbit(a));
    }

    return (
        <div className='map-actions-wrapper'>
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item label='Vĩ độ'>
                        <Input style={{ width: '200px' }} 
                        onChange={e => setPosition({ ...position, lat: e.target.value })} 
                        value={center[0]}
                        />
                    </Form.Item>
                    <Form.Item label='Kinh độ'>
                        <Input style={{ width: '200px' }} 
                        onChange={e => setPosition({ ...position, lng: e.target.value })}
                        value={center[1]} 
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' ghost onClick={handleMove}>Di chuyển</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className='map-actions-items'>
                <span>Ngày cụ thể: </span>
                <DatePicker
                    showTime
                    format='DD-MM-YYYY HH:mm:ss'
                    placeholder='Chọn ngày'
                    onChange={handleOnChange} />
            </div>
            <div className='map-actions-items'>
                <span>Khoảng thời gian: </span>
                <DatePicker.RangePicker
                    format='DD-MM-YYYY HH:mm:ss'
                    placeholder={['Từ ngày', 'Đến ngày']}
                    showTime
                    //onChange={handleOnChangeRange}
                    onOk={handleOnChangeRange}
                />
                <Button type='dashed' onClick={handleGetData}>Lấy dữ liệu</Button>
            </div>
            <div>
                {
                    listSatellite.map((satellite, index) => <p key={index}>{index} --- {satellite.name}</p>)
                }
            </div>
        </div>
    )
}

export default MapActions;
