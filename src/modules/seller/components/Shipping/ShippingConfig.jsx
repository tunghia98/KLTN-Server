import React, { useState } from 'react';

const ShippingConfig = () => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [distance, setDistance] = useState('');
  const [shippingMethod, setShippingMethod] = useState('manual');
  const [apiKey, setApiKey] = useState('');

  return (
    <div className="container p-4">
      <div className="card">
        <div className="card-content">
          <h2 className="title">Cấu hình vận chuyển</h2>

          <div className="field">
            <label>Chiều dài (cm)</label>
            <input 
              type="number" 
              value={length} 
              onChange={(e) => setLength(e.target.value)} 
              placeholder="VD: 30"
            />
          </div>

          <div className="field">
            <label>Chiều rộng (cm)</label>
            <input 
              type="number" 
              value={width} 
              onChange={(e) => setWidth(e.target.value)} 
              placeholder="VD: 20"
            />
          </div>

          <div className="field">
            <label>Chiều cao (cm)</label>
            <input 
              type="number" 
              value={height} 
              onChange={(e) => setHeight(e.target.value)} 
              placeholder="VD: 15"
            />
          </div>

          <div className="field">
            <label>Khối lượng (kg)</label>
            <input 
              type="number" 
              value={weight} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="VD: 2.5"
            />
          </div>

          <div className="field">
            <label>Khoảng cách giao hàng (km)</label>
            <input 
              type="number" 
              value={distance} 
              onChange={(e) => setDistance(e.target.value)} 
              placeholder="VD: 10"
            />
          </div>

          <div className="field">
            <label>Phương thức vận chuyển</label>
            <select value={shippingMethod} onChange={(e) => setShippingMethod(e.target.value)}>
              <option value="manual">Tự tính phí</option>
              <option value="GHN">GHN</option>
              <option value="ViettelPost">ViettelPost</option>
              <option value="J&T">J&T</option>
            </select>
          </div>

          {shippingMethod !== 'manual' && (
            <div className="field">
              <label>Nhập API Key ({shippingMethod})</label>
              <input 
                type="text" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="Nhập API Key"
              />
            </div>
          )}

          <button className="btn">Lưu cấu hình</button>
        </div>
      </div>
    </div>
  );
};

export default ShippingConfig;
