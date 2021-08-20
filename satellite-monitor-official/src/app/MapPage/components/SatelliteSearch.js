// import './SatelliteSearch.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Input, Button, Form } from '../../packages/core/adapters/ant-design';

import { filterSatellite } from '../../Redux/Position';

const SatelliteSearch = () => {
    const dispatch = useDispatch();
    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {

    };

    return (
        <>

        </>
    )
}
export default SatelliteSearch;
