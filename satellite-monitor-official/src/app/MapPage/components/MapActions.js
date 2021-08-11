import './MapActions.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DatePicker, Input, Button, Form } from '../../packages/core/adapters/ant-design';

import { setCenter, calculate_orbit } from '../../Redux/Position';
import moment from 'moment';
import MapFilter from './MapFilter'
import InputPoint from './InputPoint'

const MapActions = () => {

    const dispatch = useDispatch();
    const { totalSatellite, baseTotalSatellite, indexPredictPoint,
        coordinateOfMarkers, interfaceMapActionState} = useSelector(state => state.positionReducer);

    const [position, setPosition] = useState({ lat: '', lng: '' });
    const [rangeTime, setRangeTime] = useState([]);
    const inputPoints = () => {
        let intents = []
        for (var i = 0; i < 5; i++)
            intents.push(<InputPoint key= {`point-${i}`} index={i}/>);
        return intents
    }
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
        if (interfaceMapActionState) {
            let a = {
                lat: coordinateOfMarkers[0].lat,
                long: coordinateOfMarkers[0].lng,
                time_start: rangeTime[0] ? rangeTime[0] : '',
                time_end: rangeTime[1] ? rangeTime[1] : ''
            }
            console.log(a);
            dispatch(calculate_orbit(a));
        }
        else {
            let a = {
                
            }
            console.log(a);
            // dispatch(calculate_orbit(a));
        }
    }

    return (
        <div className='map-actions-wrapper'>
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item label='Tìm kiếm tọa độ'>
                        <Input placeholder='Vĩ độ' style={{ width: '200px' }} onChange={e => setPosition({ ...position, lat: e.target.value })}/>
                    </Form.Item>
                    <Form.Item >
                        <Input placeholder='Kinh độ' style={{ width: '200px' }} onChange={e => setPosition({ ...position, lng: e.target.value })}/>
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' ghost onClick={handleMove}>Di chuyển</Button>
                    </Form.Item>
                </Form>
            </div>
        { interfaceMapActionState ? <>            
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item label='Tọa độ vệ tinh đi qua:'>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder='Vĩ độ' style={{ width: '170px' }} value={coordinateOfMarkers[0].lat}/>
                    </Form.Item>
                    <Form.Item>
                        <Input placeholder='Kinh độ' style={{ width: '170px' }} value={coordinateOfMarkers[0].lng}/>
                    </Form.Item>
                </Form>
            </div>
        </> :
        <>
            {inputPoints()}
        </>
        }
            
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
            <> {
                interfaceMapActionState ? <></> 
                : 
                <p>Đang chọn điểm <strong>{indexPredictPoint !== 4 ? indexPredictPoint+1 : 'Trung tâm'}</strong></p>
            }            
            </>
        </div>
    )
}

export default MapActions;
