import './MapActions.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; //useSelector

import { Input, Button, Form } from '../../packages/core/adapters/ant-design';

import { setIndexPredictPoint, setCoordinateOfMarkers } from '../../Redux/Position'; //setCenter

const InputPoint = ({ index }) => {

    const dispatch = useDispatch();
    // const { listPredictPoint, } = useSelector(state => state.positionReducer);

    // const [position, setPosition] = useState({ lat: '', lng: '' });
    const {coordinateOfMarkers} = useSelector(state => state.positionReducer)
    const handleClick = () => {
        dispatch(setIndexPredictPoint(index));
    }
    const buttonSelect = () => {
        if (index !== 4)
            return <Button type='primary' ghost onClick={handleClick}> Chọn điểm thứ {index + 1}</Button>
        else
            return <Button type='primary' ghost onClick={handleClick}> Chọn điểm Trung tâm</Button>
    }
    const onChangeLat = (e) =>{
        var temp = JSON.parse(JSON.stringify(coordinateOfMarkers))
        temp[index].lat = e.target.value
        dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(temp))))
    }
    const onChangeLng = (e) =>{
        var temp = JSON.parse(JSON.stringify(coordinateOfMarkers))
        temp[index].lng = e.target.value
        dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(temp))))
    }
    return (
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item>
                    {buttonSelect()}
                    </Form.Item>
                    <Form.Item >
                        <Input placeholder='Vĩ độ' style={{ width: '100px' }} onChange={onChangeLat} onClick={handleClick}
                        value={coordinateOfMarkers[index].lat} />
                    </Form.Item>
                    <Form.Item >
                        <Input placeholder='Kinh độ' style={{ width: '100px' }} onChange={onChangeLng} onClick={handleClick}
                        value={coordinateOfMarkers[index].lng} />
                    </Form.Item>                    
                    <Form.Item>
                    </Form.Item>
                </Form>
            </div>
    )
}

export default InputPoint;
