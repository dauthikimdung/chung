import './MapActions.css';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector, } from 'react-redux';

import { DatePicker, Input, Button, Form, Modal,
ExclamationCircleOutlined, SyncOutlined, CheckCircleOutlined, message } from '../../packages/core/adapters/ant-design';

import { setCenter, calculate_orbit, calculate_orbit_multipoint, setGetSatellitesState,
setCoordinateOfMarkers} from '../../Redux/Position';
import moment from 'moment';
import MapFilter from './MapFilter'
import InputPoint from './InputPoint'

const MapActions = () => {

    const dispatch = useDispatch();
    const { totalSatellite, baseTotalSatellite, indexPredictPoint, isInside, getSatellitesState,
        coordinateOfMarkers, interfaceMapActionState} = useSelector(state => state.positionReducer);
    const [checkInput, setCheckInput] = useState(true)
    const [position, setPosition] = useState({ lat: '', lng: '' });
    const [rangeTime, setRangeTime] = useState([]);
    const inputPoints = () => {
        let intents = []
        for (var i = 0; i < 5; i++)
            intents.push(<InputPoint key= {`point-${i}`} index={i}/>);
        return intents
    }
    // Modal notice
    const [modalNoticeVisible, setVisible_ModalNotice] = useState(false);    
    // const [modalNoticeMaskClosable, setModalNoticeMaskClosable] = useState(false)

    // Modal Notice - Nội dung
    const modalNoticeText = () => {
        switch(getSatellitesState) {
            case 1: // Tiến trình crawl đang chạy / đang Truy vấn dữ liệu
                return ' Đang truy vấn dữ liệu Vệ tinh!'
            case 2: // Truy vấn dữ liệu thành công
                return ' Truy vấn dữ liệu thành công!'
            case -1: // Tiến trình crawl đang chạy / đang Truy vấn dữ liệu
                return ' Quá trình truy vấn gặp lỗi!'
            default: // Còn lại
                return ' Truy vấn thành công!'
        }
    }
    // Modal Notice - Trả về biểu tượng thông báo các loại
    const modalNoticeIcon = () => {
        switch(getSatellitesState) {
            case 1: // Tiến trình đang chạy / đang Truy vấn dữ liệu
                return <SyncOutlined spin style={{ color: '#1890ff', fontSize: '18px' }}/>
            case 2: // Truy vấn dữ liệu thành công
                return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }}/>
            case -1: // Truy vấn bị lỗi 
                return <ExclamationCircleOutlined style={{ color: '#fa3014', fontSize: '18px' }}/>
            default: // Còn lại
                return <CheckCircleOutlined style={{ color: '#faad14', fontSize: '18px' }}/>
        }
    }
    // Modal Notice - Chữ trên nút OK
    const modalNoticeOkText = () => {
        switch(getSatellitesState) {
            case 1: // Tiến trình crawl đang chạy / đang Truy vấn dữ liệu
                return 'Đang truy vấn dữ liệu'
            default: // Còn lại
                return 'Xong'
        }
    }

    // Modal Notice - Xử lý sự kiện bấm nút OK
    const modalNoticeHandleOk = () => {
        setVisible_ModalNotice(false)
        dispatch(setGetSatellitesState(0))
    };
    const handleMove = async () => {
        if (position.lat === '' || position.lng === '') {
            return;}
        let arr = [Number(position.lat), Number(position.lng)];
        await dispatch(setCenter([0,0]));
        dispatch(setCenter(arr));
    }

    const handleOnChangeRange = (value, dateString) => {
        if (value !== null && moment() < moment(value[0])) {
            const start_time = moment(value[0]).format('YYYY-MM-DD HH:mm:ss');
            const end_time = moment(value[1]).format('YYYY-MM-DD HH:mm:ss');
            setRangeTime([start_time, end_time])
        }
        else {
            setRangeTime([])
            message.warning({
                content: 'Vui lòng chọn khoảng thời gian trong tương lai!',
                style: {
                // marginTop: '10vh',
                },
                duration: 1.5
            });
        }
    }

    const handleGetData = async () => {
        setVisible_ModalNotice(true)
        dispatch(setGetSatellitesState(1))
        if (interfaceMapActionState) {
            let a = {
                lat: coordinateOfMarkers[0].lat,
                long: coordinateOfMarkers[0].lng,
                time_start: rangeTime[0] ? rangeTime[0] : '',
                time_end: rangeTime[1] ? rangeTime[1] : ''
            }
            await dispatch(calculate_orbit(a));
        }
        else {
            let a = {
                lat: coordinateOfMarkers[4].lat,
                long: coordinateOfMarkers[4].lng,
                time_start: rangeTime[0] ? rangeTime[0] : '',
                time_end: rangeTime[1] ? rangeTime[1] : '',
                obs1: coordinateOfMarkers[0],
                obs2: coordinateOfMarkers[1],
                obs3: coordinateOfMarkers[2],
                obs4: coordinateOfMarkers[3],
            }
            await dispatch(calculate_orbit_multipoint(a));
        }
    }
    

    const onChangeLat = (e) =>{
        var temp = JSON.parse(JSON.stringify(coordinateOfMarkers))
        temp[0].lat = e.target.value
        dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(temp))))
    }
    const onChangeLng = (e) =>{
        var temp = JSON.parse(JSON.stringify(coordinateOfMarkers))
        temp[0].lng = e.target.value
        dispatch(setCoordinateOfMarkers(JSON.parse(JSON.stringify(temp))))
    }
    useEffect(() => {
        console.log(rangeTime)
        setCheckInput((rangeTime.length == 0 || coordinateOfMarkers[0].lat == '' || coordinateOfMarkers[0].lng == ''))
    }, [rangeTime,coordinateOfMarkers])
    return (
        <>
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
                            <Input placeholder='Vĩ độ' style={{ width: '170px' }} onChange={onChangeLat} value={coordinateOfMarkers[0].lat}/>
                        </Form.Item>
                        <Form.Item>
                            <Input placeholder='Kinh độ' style={{ width: '170px' }} onChange={onChangeLng} value={coordinateOfMarkers[0].lng}/>
                        </Form.Item>
                    </Form>
                </div>
            </> :
            <>
                {inputPoints()}
            </>
            }            
            <div className='map-actions-items'>
                <span>Khoảng thời gian: </span>
                <DatePicker.RangePicker
                    format='DD-MM-YYYY HH:mm:ss'
                    placeholder={['Từ ngày', 'Đến ngày']}
                    showTime
                    //onChange={handleOnChangeRange}
                    onOk={handleOnChangeRange}
                />
                {interfaceMapActionState ?
                <Button type='primary' onClick={handleGetData} disabled={checkInput}>Lấy dữ liệu</Button>
                :
                <Button type='primary' onClick={handleGetData} disabled={!isInside }>Lấy dữ liệu</Button>}
                
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
        <Modal //// Modal Notice
            title="Dừng quá trình Truy vấn dữ liệu"
            visible={modalNoticeVisible}
            maskClosable={false}
            closable={false}
            footer={[
                <Button key='modal-notice' onClick={modalNoticeHandleOk} loading={getSatellitesState === 1}>
                    {modalNoticeOkText()}
                </Button>
            ]}
        >
            <p> 
                { modalNoticeIcon() }
                { modalNoticeText() }
            </p>
        </Modal>
        </>
    )
}

export default MapActions;
