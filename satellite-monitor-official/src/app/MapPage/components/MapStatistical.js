import './MapStatistical.css';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { Table, Modal, Button,
ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined } from '../../packages/core/adapters/ant-design';


const MapStatistical = () => {

    const { baseListSatellite } = useSelector(state => state.positionReducer);
    const [nations, setNations] = useState([]);
    const [specificNation, setSpecificNation] = useState('USA');
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
            title={`Danh sách các vệ tinh của`}
            visible={modalNoticeVisible}
            width={1000}            
            maskClosable={true}
            footer={[
                <Button key='modal-notice' onClick={modalNoticeHandleOk}>
                    Đóng
                </Button>
            ]}
        >
            <Table columns={columnsSatellite} dataSource={nations.filter((nation) => {
                        return nation.nation === specificNation})[0].listSatellites
                    }
                        scroll={{ y: 270 }}
                    />
        </Modal>
        </>
    )
}

export default MapStatistical;
