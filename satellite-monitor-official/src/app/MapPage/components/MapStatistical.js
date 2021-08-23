import './MapStatistical.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Table } from '../../packages/core/adapters/ant-design';


const MapStatistical = () => {

    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const [nations, setNations] = useState([]);
    const columns = [
        {
            title: 'Quốc gia',
            dataIndex: 'nation',
        },
        {
            title: 'Số vệ tinh đi qua',
            dataIndex: 'number',
            sorter: {
            compare: (a, b) => a.number - b.number,
            multiple: 1,
            },
        },
        ];
    useEffect(() => {
        let nationNames = []
        const group = baseListSatellite.reduce((groupsNation, satellite) => {
            if (!groupsNation[satellite['nation']]) {
                groupsNation[satellite['nation']] = []
                nationNames.push(satellite['nation'])
            }
            groupsNation[satellite['nation']].push(satellite['NORAD Number']);
            return groupsNation;
        }, {});
        let temp = []
        nationNames.forEach(name => {
            temp.push(
                {
                    nation: name,
                    number: group[name].length
                }
            )
        });
        setNations(temp)
    }, [baseListSatellite])
    return (
        <>
            <Table columns={columns} dataSource={nations} />
        </>
    )
}

export default MapStatistical;