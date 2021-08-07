import './MapActions.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DatePicker, Input, Button, Form } from '../../packages/core/adapters/ant-design';

import { setCenter, calculate_orbit } from '../../Redux/Position';


import moment from 'moment';
import MapFilter from './MapFilter'

const MapActions = () => {

    const dispatch = useDispatch();
    const { totalSatellite, baseTotalSatellite, predictPoint} = useSelector(state => state.positionReducer);

    const [position, setPosition] = useState({ lat: '', lng: '' });
    const [rangeTime, setRangeTime] = useState([]);


    const handleMove = async () => {
        if (position.lat === '' || position.lng === '') {
            return;}
        let arr = [Number(position.lat), Number(position.lng)];
        await dispatch(setCenter([0,0]));
        dispatch(setCenter(arr));
    }

    // const handleOnChange = (value, dateString) => {
    //     console.log(value);
    // }

    const handleOnChangeRange = (value, dateString) => {
        if (value !== null && moment() < moment(value[0])) {
            const start_time = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            const end_time = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
            setRangeTime([start_time, end_time])
        }

    }

    const handleGetData = async () => {

        let a = {
            lat: predictPoint[0],
            long: predictPoint[1],
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
                        <Input style={{ width: '200px' }} onChange={e => setPosition({ ...position, lat: e.target.value })}/>
                    </Form.Item>
                    <Form.Item label='Kinh độ'>
                        <Input style={{ width: '200px' }} onChange={e => setPosition({ ...position, lng: e.target.value })}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' ghost onClick={handleMove}>Di chuyển</Button>
                    </Form.Item>
                </Form>
            </div>
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item label='Tọa độ vệ tinh đi qua:'>
                    </Form.Item>
                    <Form.Item label='Vĩ độ'>
                        <Input style={{ width: '170px' }} value={predictPoint[0]}/>
                    </Form.Item>
                    <Form.Item label='Kinh độ'>
                        <Input style={{ width: '170px' }} value={predictPoint[1]}/>
                    </Form.Item>
                </Form>
            </div>
            {/* <div className='map-actions-items'>
                <span>Ngày cụ thể: </span>
                <DatePicker
                    showTime
                    format='DD-MM-YYYY HH:mm:ss'
                    placeholder='Chọn ngày'
                    onChange={handleOnChange} />
            </div> */}
            <div className='map-actions-items'>
                <span>Khoảng thời gian: </span>
                <DatePicker.RangePicker
                    format='DD-MM-YYYY HH:mm:ss'
                    placeholder={['Từ ngày', 'Đến ngày']}
                    showTime
                    //onChange={handleOnChangeRange}
                    onOk={handleOnChangeRange}
                />
                <Button type='primary' onClick={handleGetData}>Lấy dữ liệu</Button>
            </div>
            
            <div className='map-actions-items'>
                {/* <MapFilter></MapFilter> */}
                <strong>&nbsp;&nbsp;Số vệ tinh hiển thị: </strong> &nbsp;&nbsp;{totalSatellite} / {baseTotalSatellite}
            </div>
            
        </div>
    )
}

export default MapActions;
