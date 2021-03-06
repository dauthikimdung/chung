import './MapStatistical.css';

import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { filterSatellite } from '../../Redux/Position';
import { Table, Modal, Button,
ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined } from '../../packages/core/adapters/ant-design';


const MapStatistical = () => {
    const dispatch = useDispatch();
    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const [nations, setNations] = useState([]);
    const [numberSpecificNation, setNumberSpecificNation] = useState(0);
    const [specificNation, setSpecificNation] = useState('');
    const [listSatelliteDatasource, setListSatelliteDatasource] = useState([]);
    useEffect(() => {
        let temp = nations.filter((nation) => {
                        return nation.nation === specificNation})
        if (temp.length > 0) {
            setNumberSpecificNation(temp[0].number)
            setListSatelliteDatasource(temp[0].listSatellites)
            var listid = []
            temp[0].listSatellites
            .map((s,index) => 
            {
                listid.push(s.id)
            })
            console.log(listid)
            dispatch(
                filterSatellite(
                    baseListSatellite.filter((satellite) => {
                        return listid.includes(satellite.id)
                    })))
        }
        
    }, [specificNation])
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
    const columnsSatellite = [
        {
            title: 'Số NORAD',
            dataIndex: 'id',
            sorter: {
            compare: (a, b) => a.id - b.id,
            multiple: 1,
            },
        },
        {
            title: 'Vệ tinh',
            dataIndex: 'name',
        },
        ];
    useEffect(() => {
        let nationNames = []
        const group = baseListSatellite.reduce((groupsNation, satellite) => {
            if (!groupsNation[satellite['nation']]) {
                groupsNation[satellite['nation']] = []
                nationNames.push(satellite['nation'])
            }
            groupsNation[satellite['nation']].push({id: satellite['id'], name: satellite['name']});
            return groupsNation;
        }, {});
        let temp = []
        nationNames.forEach(name => {
            temp.push(
                {
                    nation: name,
                    number: group[name].length,
                    listSatellites: group[name]
                }
            )
        });
        setNations(temp)
    }, [baseListSatellite])
    // Modal
    const [modalNoticeVisible, setVisible_ModalNotice] = useState(false);    
    // Modal Notice - Xử lý sự kiện bấm nút OK
    const modalNoticeHandleOk = () => {
        setVisible_ModalNotice(false)
        console.log(nations.filter((nation) => {
                        return nation.nation === specificNation})[0].listSatellites)
    };
    return (
        <>
            <Table scroll={{ y: 270 }} columns={columns} dataSource={nations} onRow={(record, rowIndex) => {
                return {
                onClick: event => {
                    setVisible_ModalNotice(true)
                    setSpecificNation(record.nation)                    
                    }, // click row
                };
            }}/>
            <Modal //// Modal Notice
            title={`Danh sách các vệ tinh của ${specificNation} ( ${numberSpecificNation} vệ tinh)`}
            visible={modalNoticeVisible}
            width={1000}
            closable={false}
            footer={[
                <Button key='modal-notice' onClick={modalNoticeHandleOk}>
                    Đóng
                </Button>
            ]}
            >
            <Table columns={columnsSatellite} dataSource={listSatelliteDatasource}
                    scroll={{ y: 270 }} 
                    onRow={(record, rowIndex) => {
                        return {
                        onClick: event => {
                            dispatch(
                                filterSatellite(
                                    baseListSatellite.filter((satellite) => {
                                        return satellite.id === record.id
                                    })
                            ))
                            }, // click row
                        };
                    }}
                    />
        </Modal>
        </>
    )
}

export default MapStatistical;
