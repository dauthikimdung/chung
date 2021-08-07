import './Header.css';
import { Menu, Dropdown, DownOutlined, Checkbox, Modal, 
ExclamationCircleOutlined, SyncOutlined, QuestionCircleOutlined, CheckCircleOutlined } from '../../../core/adapters/ant-design';
import React, { useState } from 'react'; 
import { useDispatch, useSelector } from 'react-redux';
import { updateSatelliteDatabase, setUpdateState, stopUpdateSatelliteDatabase } from '../../../../Redux/Position';
const Header = () => {
    const dispatch = useDispatch()
    const [autoUpdate, setAutoUpdate] = useState(true)
    const {updateState} = useSelector(state => state.positionReducer)

    //// Modal update
    const [modalUpdateVisible, setVisible_ModalUpdate] = useState(false);
    const [modalUpdateMaskClosable, setModalUpdateMaskClosable] = useState(true)
    // Modal Update - Nội dung
    const modalUpdateText = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return ' Dữ liệu đang cập nhật! Chờ trong giây lát ...'
            case 2: // Cập nhật dữ liệu thành công
                return ' Cập nhật dữ liệu mới thành công!'
            case -1: // Cập nhật bị lỗi 
                return ' Lỗi cập nhật dữ liệu mới!!'
            default: // updateState == 0, Không cập nhật
                return ' Bạn có chắc chắn muốn cập nhật dữ liệu mới?'
        }
    }
    // Modal Update - Trả về biểu tượng thông báo các loại
    const modalUpdateIcon = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return <SyncOutlined spin style={{ color: '#1890ff', fontSize: '18px' }}/>
            case 2: // Cập nhật dữ liệu thành công
                return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }}/>
            case -1: // Cập nhật bị lỗi 
                return <ExclamationCircleOutlined style={{ color: '#fa3014', fontSize: '18px' }}/>
            default: // Còn lại
                return <QuestionCircleOutlined style={{ color: '#faad14', fontSize: '18px' }}/>
        }
    }
    // Modal Update - Chữ trên nút OK
    const modalUpdateOkText = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return 'Đang cập nhật'
            case 2: // Cập nhật dữ liệu thành công
                return 'Xong'
            case -1: // Cập nhật bị lỗi 
                return 'Thử lại'
            default: // updateState == 0, Không cập nhật
                return 'Cập nhật'
        }
    }
    // Modal Update - Chữ trên nút Cancel
    const modalUpdateCancelText = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return 'Hủy cập nhật'
            case 2: // Cập nhật dữ liệu thành công
                return 'Thoát'
            case -1: // Cập nhật bị lỗi 
                return 'Thoát'
            default: // updateState == 0, Không cập nhật
                return 'Không'
        }
    }
    // Modal Update - Sự kiện hiển thị 
    const showModalUpdate = () => {
        setVisible_ModalUpdate(true);
    }
    // Modal Update - Xử lý sự kiện bấm nút OK
    const modalUpdateHandleOk = async () => {
        switch(updateState){
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                break
            case 2: // Cập nhật dữ liệu thành công
                setVisible_ModalUpdate(false)
                dispatch(setUpdateState(0))
                break
            case -1: // Cập nhật bị lỗi
                dispatch(setUpdateState(0))
                break
            default: // updateState == 0, Không cập nhật
                setModalUpdateMaskClosable(false)
                dispatch(setUpdateState(1))
                await dispatch(updateSatelliteDatabase())
                setModalUpdateMaskClosable(true)
                break
        }
    }
    // Modal Update - Xử lý sự kiện bấm nút Cacncel
    const modalUpdateHandleCancel = () => {
        switch(updateState){
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                setVisible_ModalNotice(true)
                break
            case 2: // Cập nhật dữ liệu thành công
                setVisible_ModalUpdate(false);
                break
            case -1: // Cập nhật bị lỗi
                setVisible_ModalUpdate(false);
                dispatch(setUpdateState(0))
                break
            default: // updateState == 0, Không cập nhật
                setVisible_ModalUpdate(false);
                break
        }
            
    };

    //// Modal notice
    const [modalNoticeVisible, setVisible_ModalNotice] = useState(false);    
    const [modalNoticeMaskClosable, setModalNoticeMaskClosable] = useState(false)

    // Modal Update - Nội dung
    const modalNoticeText = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return ' Bạn có chắc chắn muốn dừng quá trình cập nhật dữ liệu mới?'
            default: // Còn lại
                return ' Đã dừng quá trình cập nhật dữ liệu!'
        }
    }
    // Modal Update - Trả về biểu tượng thông báo các loại
    const modalNoticeIcon = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return <ExclamationCircleOutlined style={{ color: '#faad14', fontSize: '18px' }}/>
            default: // Còn lại
                return <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '18px' }}/>
        }
    }
    // Modal Update - Chữ trên nút OK
    const modalNoticeOkText = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return 'Hủy cập nhật'
            default: // Còn lại
                return 'Xong'
        }
    }
    // Modal Update - Chữ trên nút Cancel
    const modalNoticeCancelText = () => {
        switch(updateState) {
            case 1: // Tiến trình crawl đang chạy / đang cập nhật dữ liệu
                return 'Không'
            default: // Còn lại
                return 'Thoát'
        }
    }
    
    // Modal Notice - Xử lý sự kiện bấm nút OK
    const modalNoticeHandleOk = async () => {
        if (updateState === 1){
            await dispatch(stopUpdateSatelliteDatabase())
            dispatch(setUpdateState(0))
            setModalUpdateMaskClosable(true)
            setVisible_ModalUpdate(false)
            setModalNoticeMaskClosable(true)
        }
        else {
            setVisible_ModalNotice(false)
            dispatch(setUpdateState(0))
        }
        
    };
    // Modal Notice - Xử lý sự kiện bấm nút Cancel
    const modalNoticeHandleCancel = () => {
            setVisible_ModalNotice(false)
    };

    const menu =
        (
            <Menu>
                <Menu.Item>
                    <Checkbox checked={autoUpdate} >
                        Tự động cập nhật dữ liệu
                    </Checkbox>
                </Menu.Item>
            </Menu>
        );

    return (
        <div className='header'>
            <div className='text-header'>
                <span>công cụ trinh sát</span>
            </div>
            <div className='left-actions'>
                <ul>
                    <li onClick={showModalUpdate}>
                        Cập nhật dữ liệu
                    </li>
                    <li>
                        <Dropdown overlay={menu} placement='bottomLeft' arrow>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                Cài đặt
                                <DownOutlined style={{ fontSize: '1rem', fontWeight: 'bold', padding: '3px 0px 0px 5px' }} />
                            </div>
                        </Dropdown>
                    </li>
                </ul>
            </div>
            <div className="right-actions">
            </div>
            <Modal //// Modal Update
                title="Cập nhật dữ liệu"
                visible={modalUpdateVisible}
                onOk={modalUpdateHandleOk}
                confirmLoading={updateState === 1} // Tiến trình crawl đang chạy / đang cập nhật dữ liệu thì trả về True; Còn lại trả về False
                onCancel={modalUpdateHandleCancel}
                cancelText={modalUpdateCancelText()}
                okText={modalUpdateOkText()}
                maskClosable={modalUpdateMaskClosable}
                cancelButtonProps={{ danger: true }}
                // width={400}
            >
                <p> 
                    { modalUpdateIcon() } 
                    { modalUpdateText() }
                </p>
            </Modal>
            <Modal //// Modal Notice
                title="Dừng quá trình cập nhật dữ liệu"
                visible={modalNoticeVisible}
                onOk={modalNoticeHandleOk}
                onCancel={modalNoticeHandleCancel}
                cancelText={modalNoticeCancelText()}
                okText={modalNoticeOkText()}
                okType='danger'
                maskClosable={modalNoticeMaskClosable}
            >
                <p> 
                    { modalNoticeIcon() }
                    { modalNoticeText() }
                </p>
            </Modal>
        </div>
    )
}

export default Header;