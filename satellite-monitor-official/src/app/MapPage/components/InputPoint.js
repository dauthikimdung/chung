import './MapActions.css';

import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; //useSelector

import { Input, Button, Form } from '../../packages/core/adapters/ant-design';

import { setIndexPredictPoint } from '../../Redux/Position'; //setCenter

const InputPoint = ({ index }) => {

    const dispatch = useDispatch();
    // const { listPredictPoint, } = useSelector(state => state.positionReducer);

    const [position, setPosition] = useState({ lat: '', lng: '' });

    const handleClick = () => {
        dispatch(setIndexPredictPoint(index));
    }
    const buttonSelect = () => {
        if (index !== 4)
            return <Button type='primary' ghost onClick={handleClick}> Chọn điểm thứ {index + 1}</Button>
        else
            return <Button type='primary' ghost onClick={handleClick}> Chọn điểm Trung tâm</Button>
    }
    return (
            <div className='map-actions-items'>
                <Form layout='inline'>
                    <Form.Item>
                    {buttonSelect()}
                    </Form.Item>
                    <Form.Item >
                        <Input placeholder='Vĩ độ' style={{ width: '170px' }} onChange={e => setPosition({ ...position, lat: e.target.value })}/>
                    </Form.Item>
                    <Form.Item >
                        <Input placeholder='Kinh độ' style={{ width: '170px' }} onChange={e => setPosition({ ...position, lng: e.target.value })}/>
                    </Form.Item>                    
                    <Form.Item>
                    </Form.Item>
                </Form>
            </div>
    )
}

export default InputPoint;
