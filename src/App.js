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
      <div className="container">
        <div className="text-center mb-20">
          <div className="flex" style={{justifyContent: 'center'}}>
            <ChefHat size={48} color="white" />
            <h1 className="text-white" style={{fontSize: '32px', marginLeft: '10px'}}>La Taberna del Café</h1>
          </div>
          <p className="text-white">Sistema de Pedidos de Menús</p>
        </div>

        <div className="card" style={{maxWidth: '400px', margin: '0 auto'}}>
          <div className="flex mb-20">
            <User size={24} color="#8B4513" />
            <h2 className="text-amber">Verificación de Empleado</h2>
          </div>

          <label className="text-amber">Número de Cédula</label>
          <input
            type="text"
            className="input"
            value={cedula}
            onChange={(e) => setCedula(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingrese su número de cédula"
            maxLength="15"
          />

          {error && <p style={{color: 'red', fontSize: '14px'}}>{error}</p>}

          <button 
            className="btn btn-primary" 
            onClick={handleSearch}
            disabled={cedula.length < 6 || searchingEmployee}
            style={{width: '100%'}}
          >
            {searchingEmployee ? 'Consultando...' : 'Consultar'}
          </button>

          {foundEmployee && (
            <div style={{background: '#f0fdf4', border: '1px solid #22c55e', borderRadius: '8px', padding: '15px', margin: '15px 0'}}>
              <h4 style={{color: '#166534', marginBottom: '10px'}}>✅ Empleado Verificado</h4>
              <div className="flex mb-20">
                <User size={16} color="#22c55e" />
                <span style={{color: '#166534', fontWeight: 'bold'}}>{foundEmployee.name}</span>
              </div>
              <div className="flex mb-20">
                <Building2 size={16} color="#22c55e" />
                <span style={{color: '#166534'}}>{foundEmployee.company}</span>
              </div>
              <div className="flex">
                <CreditCard size={16} color="#22c55e" />
                <span style={{color: '#166534'}}>Plan {foundEmployee.plan}</span>
                {foundEmployee.plan === 'premium' && (
                  <span style={{background: '#fef3c7', color: '#d97706', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', marginLeft: '8px'}}>
                    Premium
                  </span>
                )}
              </div>
              <button 
                className="btn btn-success mt-20" 
                onClick={handleLoadMenus}
                style={{width: '100%'}}
              >
                Cargar Menús
              </button>
            </div>
          )}

          <div className="text-center mt-20">
            <p style={{fontSize: '12px', color: '#8B4513'}}>Datos de prueba:</p>
            <p style={{fontSize: '12px', color: '#A0522D'}}><strong>Premium:</strong> 12345678</p>
            <p style={{fontSize: '12px', color: '#A0522D'}}><strong>Básico:</strong> 87654321</p>
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
        <div className="flex mb-20">
          <ChefHat size={24} color="#8B4513" />
          <div>
            <h3 className="text-amber">{title}</h3>
            <p style={{fontSize: '14px', color: '#A0522D'}}>{subtitle}</p>
          </div>
        </div>
        <div className="grid">
          {menuData[category].map(item => (
            <div
              key={item.id}
              className={`menu-item ${isItemSelected(category, item.id) ? 
                (category === 'ensaladas' ? 'selected-multiple' : 'selected') : ''}`}
              onClick={() => handleItemSelect(category, item.id)}
            >
              <div className="flex-between">
                <h4 className="text-amber">{item.name}</h4>
                {isItemSelected(category, item.id) && (
                  <span style={{
                    background: category === 'ensaladas' ? '#3b82f6' : '#22c55e',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px'
                  }}>✓</span>
                )}
              </div>
              <p style={{fontSize: '14px', color: '#A0522D', margin: '8px 0'}}>{item.desc}</p>
              <div>
                <span style={{background: '#D2B48C', color: '#654321', padding: '4px 8px', borderRadius: '4px', fontSize: '12px'}}>
                  {employee.plan}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    return (
      <div className="container">
        <div className="text-center mb-20">
          <div className="flex" style={{justifyContent: 'center'}}>
            <ChefHat size={32} color="white" />
            <h1 className="text-white" style={{fontSize: '24px', marginLeft: '10px'}}>La Taberna del Café</h1>
          </div>
          <p className="text-white">Hola {employee.name}, selecciona tu menú para: {DAYS[currentDay]}</p>
        </div>

        <div className="days-nav">
          {DAYS.map((day, index) => (
            <button
              key={day}
              className={`day-btn ${index === currentDay ? 'active' : 
                isDayCompleted(day) ? 'completed' : 'inactive'}`}
              onClick={() => setCurrentDay(index)}
            >
              {day}
            </button>
          ))}
        </div>

        {renderCategory('platos', 'Platos Principales', '(Selecciona uno)')}
        {renderCategory('ensaladas', 'Ensaladas', '(Selecciona una o varias)')}
        {renderCategory('postres', 'Postres', '(Selecciona uno)')}

        <div className="flex-between mt-20">
          <button className="btn btn-secondary" onClick={() => setScreen('login')}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div className="flex">
            <button 
              className="btn btn-secondary" 
              onClick={() => setCurrentDay(Math.max(0, currentDay - 1))}
              disabled={currentDay === 0}
            >
              <ArrowLeft size={16} /> Anterior
            </button>
            <span className="text-white">Día {currentDay + 1} de {DAYS.length}</span>
            <button className="btn btn-primary" onClick={() => setScreen('summary')}>
              <Check size={16} /> Ver Resumen
            </button>
            <button 
              className="btn btn-success" 
              onClick={() => setCurrentDay(Math.min(DAYS.length - 1, currentDay + 1))}
              disabled={currentDay === DAYS.length - 1}
            >
              Siguiente <ArrowRight size={16} />
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
      <div className="container">
        <div className="text-center mb-20">
          <div className="flex" style={{justifyContent: 'center'}}>
            <ChefHat size={32} color="white" />
            <h1 className="text-white" style={{fontSize: '24px', marginLeft: '10px'}}>La Taberna del Café</h1>
          </div>
          <p className="text-white">Resumen de tu pedido semanal</p>
          <p className="text-white">{employee.name} - {employee.company}</p>
        </div>

        <div className="card">
          {DAYS.map((day, index) => {
            const dayKey = day.toLowerCase();
            const dayOrder = orders[dayKey];
            
            if (!dayOrder || Object.keys(dayOrder).length === 0) return null;
            
            return (
              <div key={day} style={{borderBottom: '1px solid #D2B48C', paddingBottom: '20px', marginBottom: '20px'}}>
                <h3 className="text-amber mb-20">{day}</h3>
                <div className="grid">
                  {dayOrder.platos && dayOrder.platos.length > 0 && (
                    <div>
                      <h4 style={{color: '#8B4513', marginBottom: '10px'}}>Plato Principal:</h4>
                      {dayOrder.platos.map(id => (
                        <p key={id} style={{color: '#A0522D', marginLeft: '15px'}}>• {getItemName('platos', id)}</p>
                      ))}
                    </div>
                  )}
                  {dayOrder.ensaladas && dayOrder.ensaladas.length > 0 && (
                    <div>
                      <h4 style={{color: '#8B4513', marginBottom: '10px'}}>Ensaladas:</h4>
                      {dayOrder.ensaladas.map(id => (
                        <p key={id} style={{color: '#A0522D', marginLeft: '15px'}}>• {getItemName('ensaladas', id)}</p>
                      ))}
                    </div>
                  )}
                  {dayOrder.postres && dayOrder.postres.length > 0 && (
                    <div>
                      <h4 style={{color: '#8B4513', marginBottom: '10px'}}>Postre:</h4>
                      {dayOrder.postres.map(id => (
                        <p key={id} style={{color: '#A0522D', marginLeft: '15px'}}>• {getItemName('postres', id)}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-between mt-20">
          <button className="btn btn-secondary" onClick={() => setScreen('menu')}>
            <ArrowLeft size={16} /> Modificar
          </button>
          <button 
            className="btn btn-success" 
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
      canvas.width = 300;
      canvas.height = 80;
      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'black';
      
      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        const digit = isNaN(parseInt(char)) ? char.charCodeAt(0) % 10 : parseInt(char);
        const x = 20 + i * 24;
        
        for (let j = 0; j < digit + 1; j++) {
          if (j % 2 === 0) {
            ctx.fillRect(x + j * 2, 10, 2, 40);
          }
        }
      }
      
      ctx.fillStyle = 'black';
      ctx.font = '12px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(code, canvas.width / 2, 70);
      
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
      <div className="container">
        <div className="text-center mb-20">
          <div className="flex" style={{justifyContent: 'center'}}>
            <div style={{
              width: '64px', 
              height: '64px', 
              background: '#22c55e', 
              borderRadius: '50%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              marginRight: '15px'
            }}>
              <Check size={32} color="white" />
            </div>
            <h1 className="text-white" style={{fontSize: '32px'}}>¡Pedido Confirmado!</h1>
          </div>
          <p className="text-white">Tu orden semanal ha sido procesada exitosamente</p>
        </div>

        <div className="card text-center">
          <h2 className="text-amber mb-20">Código de Pedido</h2>
          <div style={{background: 'white', padding: '20px', borderRadius: '10px', border: '2px solid #D2B48C', marginBottom: '20px'}}>
            <img src={generateBarcode(orderCode)} alt="Código de barras" style={{marginBottom: '10px'}} />
            <p style={{fontFamily: 'monospace', fontSize: '18px', fontWeight: 'bold', color: '#8B4513'}}>{orderCode}</p>
          </div>
          <p style={{fontSize: '14px', color: '#A0522D', marginBottom: '20px'}}>
            Presenta este código en el restaurante para retirar tu pedido
          </p>

          <div style={{background: '#FFF8DC', padding: '20px', borderRadius: '10px', marginBottom: '20px'}}>
            <h3 style={{color: '#8B4513', marginBottom: '15px'}}>Detalles del Pedido</h3>
            <p><strong>Empleado:</strong> {employee.name}</p>
            <p><strong>Empresa:</strong> {employee.company}</p>
            <p><strong>Plan:</strong> {employee.plan}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
          </div>

          <div className="flex" style={{justifyContent: 'center'}}>
            <button className="btn btn-primary" onClick={downloadPDF}>
              <Download size={16} /> Descargar PDF
            </button>
            <button className="btn btn-secondary" onClick={() => setScreen('summary')}>
              Ver Resumen
            </button>
            <button className="btn btn-secondary" onClick={handleNewOrder}>
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