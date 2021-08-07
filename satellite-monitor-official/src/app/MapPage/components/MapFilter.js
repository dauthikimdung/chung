import './MapFilter.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Divider, Checkbox } from '../../packages/core/adapters/ant-design';

import { filterSatellite } from '../../Redux/Position';

const MapFilter = () => {
    const dispatch = useDispatch();
    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const CheckboxGroup = Checkbox.Group;
    const plainOptions = ['Starlink', 'SpaceBEE', 'OneWeb', 'Others']; //Cosmos, USA, ORBCOMM, Lemur, Iridium, Dove, Yaogan  
    const defaultCheckedList = ['Starlink', 'SpaceBEE', 'OneWeb', 'Others'];
    
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);  
        if (list.includes('Others')){
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
                Check all
            </Checkbox>
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
        </>
    )
}
export default MapFilter;
