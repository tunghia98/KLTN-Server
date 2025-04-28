import React, { useState } from 'react';
import './ShippingConfig.css'; // Đảm bảo import file CSS

const ShippingConfig = () => {
  const [shippingConfigs, setShippingConfigs] = useState([
    { id: 1, minWeight: '', maxWeight: '', distance: '', fee: '', region: '', size: '', shippingMethod: 'manual' },
  ]);
  const [savedConfigs, setSavedConfigs] = useState([]); // Dữ liệu lưu lại sau khi chỉnh sửa

  const handleChange = (index, e) => {
    const { name, value } = e.target;
    const updatedConfigs = [...shippingConfigs];
    updatedConfigs[index][name] = value;
    setShippingConfigs(updatedConfigs);
  };

  const handleAddRow = () => {
    setShippingConfigs([
      ...shippingConfigs,
      { id: shippingConfigs.length + 1, minWeight: '', maxWeight: '', distance: '', fee: '', region: '', size: '', shippingMethod: 'manual' },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updatedConfigs = shippingConfigs.filter((_, i) => i !== index);
    setShippingConfigs(updatedConfigs);
  };

  const handleSaveRow = (index) => {
    const rowToSave = shippingConfigs[index]; // Lấy row hiện tại
    setSavedConfigs([...savedConfigs, rowToSave]); // Lưu vào bảng hiển thị
  };

  const handleSaveConfig = () => {
    console.log('Saved Shipping Configs:', savedConfigs);
  };

  return (
    <div className="shipping-container">
      <div className="shipping-card">
        <div className="shipping-card-content">
          <h2 className="shipping-title">Cấu hình phí vận chuyển</h2>

          {/* Bảng chỉnh sửa */}
          <h3>Bảng chỉnh sửa</h3>
          <table className="shipping-table">
            <thead>
              <tr>
                <th>Khối lượng tối đa (kg)</th>
                <th>Kích thước tối đa (cm)</th>
                <th>Bán kính tối đa (km)</th>
                <th>Phí vận chuyển (VND)</th>
                <th>Phương thức vận chuyển</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {shippingConfigs.map((config, index) => (
                <tr key={config.id}>
                  <td>
                    <input
                      type="text"
                      name="minWeight"
                      value={config.minWeight}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="VD: 0"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="size"
                      value={config.size}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="VD: 30x20x15"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="distance"
                      value={config.distance}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="VD: 10"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="fee"
                      value={config.fee}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="VD: 30000"
                    />
                  </td>

                  <td>
                    <select
                      name="shippingMethod"
                      value={config.shippingMethod}
                      onChange={(e) => handleChange(index, e)}
                    >
                      <option value="manual">Đơn vị vận chuyển</option>
                      <option value="GHN">Đơn vị vận tải</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteRow(index)}>Xóa</button>
                    <button onClick={() => handleSaveRow(index)}>Lưu</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn-add-row" onClick={handleAddRow}>Thêm dòng</button>

          {/* Bảng hiển thị các cấu hình đã lưu */}
          <h3>Bảng hiển thị cấu hình đã lưu</h3>
          <table className="shipping-table">
            <thead>
              <tr>
                <th>Khối lượng tối đa (kg)</th>
                <th>Kích thước tối đa (cm)</th>
                <th>Bán kính tối đa (km)</th>
                <th>Phí vận chuyển (VND)</th>
                <th>Phương thức vận chuyển</th>
              </tr>
            </thead>
            <tbody>
              {savedConfigs.map((config, index) => (
                <tr key={index}>
                  <td>{config.minWeight}</td>
                  <td>{config.size}</td>
                  <td>{config.distance}</td>
                  <td>{config.fee}</td>
                  <td>{config.shippingMethod === 'manual' ? 'Đơn vị vận chuyển' : 'Đơn vị vận tải'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="btn-save" onClick={handleSaveConfig}>Lưu tất cả cấu hình</button>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfig;
