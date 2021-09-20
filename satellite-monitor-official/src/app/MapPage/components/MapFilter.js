import './MapFilter.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Divider, Checkbox } from '../../packages/core/adapters/ant-design';

import { filterSatellite } from '../../Redux/Position';

const MapFilter = () => {
    const dispatch = useDispatch();
    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const CheckboxGroup = Checkbox.Group;
    const plainOptions = ['Starlink', 'SpaceBEE', 'OneWeb', 'Các vệ tinh khác']; //Cosmos, USA, ORBCOMM, Lemur, Iridium, Dove, Yaogan  
    const defaultCheckedList = ['Starlink', 'SpaceBEE', 'OneWeb', 'Các vệ tinh khác'];
    
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);  
        if (list.includes('Các vệ tinh khác')){
            console.log(typeof(baseListSatellite))
            dispatch(
                filterSatellite(
                    baseListSatellite.filter((satellite) => {
                        return list.some(subName => satellite.name.toLowerCase().includes(subName.toLowerCase())) 
                                | !plainOptions.some(subName => satellite.name.toLowerCase().includes(subName.toLowerCase()))
                    })
                )
            )
        }
        else
            dispatch(filterSatellite(baseListSatellite.filter((satellite) => {
                return list.some(subName => satellite.name.toLowerCase().includes(subName.toLowerCase()))
            })))
        // console.log(listSatellite)
    };

    const onCheckAllChange = e => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
        // console.log(baseListSatellite)
        dispatch(filterSatellite(baseListSatellite.filter((satellite) => {
            return (e.target.checked ? true : false)
        })))
    };

    return (
        <>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
                Chọn hết
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
        </>
    )
}
export default MapFilter;
