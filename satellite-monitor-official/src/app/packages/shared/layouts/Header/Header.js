import './Header.css';
import { Menu, Dropdown, DownOutlined } from '../../../core/adapters/ant-design';

const Header = () => {

    const menu =
        (
            <Menu>
                <Menu.Item>
                    Lựa chọn 1
                </Menu.Item>
                <Menu.Item>
                    Lựa chọn 2
                </Menu.Item>
                <Menu.Item>
                    Lựa chọn 3
                </Menu.Item>
                <Menu.Item>
                    Lựa chọn 4
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
                    <li>
                        Nút 1
                    </li>
                    <li>
                        Nút 2
                    </li>
                    <li>
                        Nút 3
                    </li>
                    <li>
                        Nút 4
                    </li>
                    <li>
                        <Dropdown overlay={menu} placement='bottomLeft' arrow>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                Nút 5
                                <DownOutlined style={{ fontSize: '1rem', fontWeight: 'bold', padding: '3px 0px 0px 5px' }} />
                            </div>
                        </Dropdown>
                    </li>
                </ul>
            </div>
            <div className="right-actions">
            </div>
        </div>
    )
}

export default Header;