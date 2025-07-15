import React, { useState } from 'react';
import { ChefHat, User, Building2, CreditCard, ArrowLeft, ArrowRight, Check, Download } from 'lucide-react';
import { EMPLOYEES, MENUS, DAYS } from './data';
import './index.css';

function App() {
  // Estados principales
  const [screen, setScreen] = useState('login'); // login, menu, summary, confirmed
  const [employee, setEmployee] = useState(null);
  const [currentDay, setCurrentDay] = useState(0);
  const [orders, setOrders] = useState({}); // {monday: {platos: [...], ensaladas: [...], postres: [...]}}
  const [orderCode, setOrderCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Función para simular delay
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // LOGIN SCREEN
  const LoginScreen = () => {
    const [cedula, setCedula] = useState('');
    const [searchingEmployee, setSearchingEmployee] = useState(false);
    const [foundEmployee, setFoundEmployee] = useState(null);

    const handleSearch = async () => {
      if (cedula.length < 6) {
        setError('Mínimo 6 dígitos');
        return;
      }

      setSearchingEmployee(true);
      setError('');
      
      await delay(1000);
      
      const emp = EMPLOYEES[cedula];
      if (emp) {
        setFoundEmployee(emp);
      } else {
        setError('Empleado no encontrado');
        setFoundEmployee(null);
      }
      
      setSearchingEmployee(false);
    };

    const handleLoadMenus = () => {
      setEmployee(foundEmployee);
      setScreen('menu');
    };

    return (
      <div className="container mobile-container">
        <div className="text-center mb-20">
          <div className="header-flex">
            <ChefHat className="header-icon" />
            <h1 className="main-title">La Taberna del Café</h1>
          </div>
          <p className="subtitle">Sistema de Pedidos de Menús</p>
        </div>

        <div className="login-card">
          <div className="flex mb-20">
            <User size={24} color="#8B4513" />
            <h2 className="section-title">Verificación de Empleado</h2>
          </div>

          <label className="input-label">Número de Cédula</label>
          <input
            type="text"
            className="input mobile-input"
            value={cedula}
            onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingrese su número de cédula"
            maxLength="15"
            inputMode="numeric"
            autoComplete="off"
          />

          {error && <p className="error-text">{error}</p>}

          <button 
            className="btn btn-primary mobile-btn" 
            onClick={handleSearch}
            disabled={cedula.length < 6 || searchingEmployee}
          >
            {searchingEmployee ? 'Consultando...' : 'Consultar'}
          </button>

          {foundEmployee && (
            <div className="employee-card">
              <h4 className="employee-title">✅ Empleado Verificado</h4>
              <div className="employee-info">
                <div className="info-row">
                  <User size={16} color="#22c55e" />
                  <span className="info-text">{foundEmployee.name}</span>
                </div>
                <div className="info-row">
                  <Building2 size={16} color="#22c55e" />
                  <span className="info-text">{foundEmployee.company}</span>
                </div>
                <div className="info-row">
                  <CreditCard size={16} color="#22c55e" />
                  <span className="info-text">Plan {foundEmployee.plan}</span>
                  {foundEmployee.plan === 'premium' && (
                    <span className="premium-badge">Premium</span>
                  )}
                </div>
              </div>
              <button 
                className="btn btn-success mobile-btn mt-20" 
                onClick={handleLoadMenus}
              >
                Cargar Menús
              </button>
            </div>
          )}

          <div className="test-data">
            <p className="test-title">Datos de prueba:</p>
            <p className="test-item"><strong>Premium:</strong> 12345678</p>
            <p className="test-item"><strong>Básico:</strong> 87654321</p>
          </div>
        </div>
      </div>
    );
  };

  // MENU SCREEN
  const MenuScreen = () => {
    const menuData = MENUS[employee.plan];

    const isItemSelected = (category, itemId) => {
      const currentDayKey = DAYS[currentDay].toLowerCase();
      return orders[currentDayKey]?.[category]?.includes(itemId) || false;
    };

    const handleItemSelect = (category, itemId) => {
      const dayKey = DAYS[currentDay].toLowerCase();
      
      setOrders(prev => {
        const newOrders = { ...prev };
        
        // Inicializar si no existe
        if (!newOrders[dayKey]) newOrders[dayKey] = {};
        if (!newOrders[dayKey][category]) newOrders[dayKey][category] = [];
        
        if (category === 'ensaladas') {
          // ENSALADAS: MÚLTIPLES
          const currentList = [...newOrders[dayKey][category]];
          const index = currentList.indexOf(itemId);
          
          if (index >= 0) {
            currentList.splice(index, 1); // Quitar
          } else {
            currentList.push(itemId); // Agregar
          }
          
          newOrders[dayKey][category] = currentList;
        } else {
          // PLATOS Y POSTRES: SOLO UNO
          newOrders[dayKey][category] = [itemId];
        }
        
        return newOrders;
      });
    };

    const isDayCompleted = (day) => {
      const dayData = orders[day.toLowerCase()];
      return dayData?.platos?.length > 0;
    };

    const renderCategory = (category, title, subtitle) => (
      <div className="card">
        <div className="category-header">
          <ChefHat size={20} color="#8B4513" />
          <div>
            <h3 className="category-title">{title}</h3>
            <p className="category-subtitle">{subtitle}</p>
          </div>
        </div>
        <div className="menu-grid">
          {menuData[category].map(item => (
            <div
              key={item.id}
              className={`menu-item ${isItemSelected(category, item.id) ? 
                (category === 'ensaladas' ? 'selected-multiple' : 'selected') : ''}`}
              onClick={() => handleItemSelect(category, item.id)}
            >
              <div className="menu-item-header">
                <h4 className="menu-item-title">{item.name}</h4>
                {isItemSelected(category, item.id) && (
                  <span className={`check-icon ${category === 'ensaladas' ? 'check-multiple' : 'check-single'}`}>
                    ✓
                  </span>
                )}
              </div>
              <p className="menu-item-desc">{item.desc}</p>
              <div className="menu-item-footer">
                <span className="plan-badge">{employee.plan}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="container mobile-container">
        <div className="text-center mb-20">
          <div className="header-flex">
            <ChefHat className="header-icon-small" />
            <h1 className="page-title">La Taberna del Café</h1>
          </div>
          <p className="subtitle">Hola {employee.name}, selecciona tu menú para: {DAYS[currentDay]}</p>
        </div>

        <div className="days-nav">
          {DAYS.map((day, index) => (
            <button
              key={day}
              className={`day-btn ${index === currentDay ? 'active' : 
                isDayCompleted(day) ? 'completed' : 'inactive'}`}
              onClick={() => setCurrentDay(index)}
            >
              {day.slice(0, 3)}
            </button>
          ))}
        </div>

        {renderCategory('platos', 'Platos Principales', '(Selecciona uno)')}
        {renderCategory('ensaladas', 'Ensaladas', '(Selecciona una o varias)')}
        {renderCategory('postres', 'Postres', '(Selecciona uno)')}

        <div className="navigation-buttons">
          <button className="btn btn-secondary mobile-btn" onClick={() => setScreen('login')}>
            <ArrowLeft size={16} /> Volver
          </button>
          
          <div className="nav-controls">
            <button 
              className="btn btn-secondary nav-btn" 
              onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
              disabled={currentDay === 0}
            >
              <ArrowLeft size={14} />
            </button>
            
            <span className="day-indicator">Día {currentDay + 1}/{DAYS.length}</span>
            
            <button className="btn btn-primary nav-btn" onClick={() => setScreen('summary')}>
              <Check size={14} />
            </button>
            
            <button 
              className="btn btn-success nav-btn" 
              onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
              disabled={currentDay === DAYS.length - 1}
            >
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // SUMMARY SCREEN
  const SummaryScreen = () => {
    const handleConfirm = async () => {
      setLoading(true);
      await delay(1500);
      
      const timestamp = Date.now().toString();
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      setOrderCode(`TC${timestamp.slice(-6)}${random}`);
      
      setLoading(false);
      setScreen('confirmed');
    };

    const getItemName = (category, itemId) => {
      const menuData = MENUS[employee.plan];
      const item = menuData[category].find(i => i.id === itemId);
      return item ? item.name : 'Item no encontrado';
    };

    return (
      <div className="container mobile-container">
        <div className="text-center mb-20">
          <div className="header-flex">
            <ChefHat className="header-icon-small" />
            <h1 className="page-title">La Taberna del Café</h1>
          </div>
          <p className="subtitle">Resumen de tu pedido semanal</p>
          <p className="subtitle">{employee.name} - {employee.company}</p>
        </div>

        <div className="card">
          {DAYS.map((day, index) => {
            const dayKey = day.toLowerCase();
            const dayOrder = orders[dayKey];
            
            if (!dayOrder || Object.keys(dayOrder).length === 0) return null;
            
            return (
              <div key={day} className="day-summary">
                <h3 className="day-title">{day}</h3>
                <div className="summary-content">
                  {dayOrder.platos && dayOrder.platos.length > 0 && (
                    <div className="category-summary">
                      <h4 className="summary-category">Plato Principal:</h4>
                      {dayOrder.platos.map(id => (
                        <p key={id} className="summary-item">• {getItemName('platos', id)}</p>
                      ))}
                    </div>
                  )}
                  {dayOrder.ensaladas && dayOrder.ensaladas.length > 0 && (
                    <div className="category-summary">
                      <h4 className="summary-category">Ensaladas:</h4>
                      {dayOrder.ensaladas.map(id => (
                        <p key={id} className="summary-item">• {getItemName('ensaladas', id)}</p>
                      ))}
                    </div>
                  )}
                  {dayOrder.postres && dayOrder.postres.length > 0 && (
                    <div className="category-summary">
                      <h4 className="summary-category">Postre:</h4>
                      {dayOrder.postres.map(id => (
                        <p key={id} className="summary-item">• {getItemName('postres', id)}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="summary-actions">
          <button className="btn btn-secondary mobile-btn" onClick={() => setScreen('menu')}>
            <ArrowLeft size={16} /> Modificar
          </button>
          <button 
            className="btn btn-success mobile-btn" 
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Confirmando...' : <><Check size={16} /> Confirmar Pedido</>}
          </button>
        </div>
      </div>
    );
  };

  // CONFIRMED SCREEN
  const ConfirmedScreen = () => {
    const generateBarcode = (code) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 280;
      canvas.height = 70;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const digit = isNaN(parseInt(char)) ? char.charCodeAt(0) % 10 : parseInt(char);
        const x = 20 + i * 22;
        
        for (let j = 0; j < digit + 1; j++) {
          if (j % 2 === 0) {
            ctx.fillRect(x + j * 2, 10, 2, 35);
          }
        }
      }
      
      ctx.fillStyle = 'black';
      ctx.font = '10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(code, canvas.width / 2, 60);
      
      return canvas.toDataURL();
    };

    const downloadPDF = () => {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head><title>Pedido - La Taberna del Café</title></head>
          <body style="font-family: Arial; padding: 20px;">
            <h1 style="text-align: center; color: #8B4513;">🍽️ La Taberna del Café</h1>
            <h2 style="text-align: center; color: #A0522D;">Resumen de Pedido</h2>
            <div style="background: #FFF8DC; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <p><strong>Empleado:</strong> ${employee.name}</p>
              <p><strong>Empresa:</strong> ${employee.company}</p>
              <p><strong>Plan:</strong> ${employee.plan}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <h3>Código de Pedido</h3>
              <img src="${generateBarcode(orderCode)}" alt="Código de barras" />
              <p style="font-family: monospace; font-size: 16px; font-weight: bold;">${orderCode}</p>
            </div>
            <div style="text-align: center; margin-top: 40px;">
              <p>¡Gracias por tu pedido!</p>
              <p style="font-size: 12px; color: #666;">© 2025 La Taberna del Café</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    };

    const handleNewOrder = () => {
      setEmployee(null);
      setOrders({});
      setCurrentDay(0);
      setOrderCode('');
      setError('');
      setLoading(false);
      setScreen('login');
    };

    return (
      <div className="container mobile-container">
        <div className="text-center mb-20">
          <div className="success-header">
            <div className="success-icon">
              <Check size={24} color="white" />
            </div>
            <h1 className="success-title">¡Pedido Confirmado!</h1>
          </div>
          <p className="subtitle">Tu orden semanal ha sido procesada exitosamente</p>
        </div>

        <div className="card text-center">
          <h2 className="section-title mb-20">Código de Pedido</h2>
          <div className="barcode-container">
            <img src={generateBarcode(orderCode)} alt="Código de barras" className="barcode-image" />
            <p className="order-code">{orderCode}</p>
          </div>
          <p className="barcode-instruction">
            Presenta este código en el restaurante para retirar tu pedido
          </p>

          <div className="order-details">
            <h3 className="details-title">Detalles del Pedido</h3>
            <div className="details-content">
              <p><strong>Empleado:</strong> {employee.name}</p>
              <p><strong>Empresa:</strong> {employee.company}</p>
              <p><strong>Plan:</strong> {employee.plan}</p>
              <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="confirmed-actions">
            <button className="btn btn-primary mobile-btn" onClick={downloadPDF}>
              <Download size={16} /> Descargar PDF
            </button>
            <button className="btn btn-secondary mobile-btn" onClick={() => setScreen('summary')}>
              Ver Resumen
            </button>
            <button className="btn btn-secondary mobile-btn" onClick={handleNewOrder}>
              Nuevo Pedido
            </button>
          </div>
        </div>
      </div>
    );
  };

  // RENDER MAIN APP
  const renderScreen = () => {
    switch(screen) {
      case 'login': return <LoginScreen />;
      case 'menu': return <MenuScreen />;
      case 'summary': return <SummaryScreen />;
      case 'confirmed': return <ConfirmedScreen />;
      default: return <LoginScreen />;
    }
  };

  return (
    <div className="App">
      {renderScreen()}
    </div>
  );
}

export default App;