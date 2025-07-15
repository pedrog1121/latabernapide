export const EMPLOYEES = {
  "12345678": { name: "Juan Pérez", company: "Empresa ABC", plan: "premium" },
  "87654321": { name: "María González", company: "Tech Solutions", plan: "basic" }
};

export const MENUS = {
  premium: {
    platos: [
      { id: "p1", name: "Pollo a la plancha", desc: "Pollo con especias", price: 12.50 },
      { id: "p2", name: "Salmón grillado", desc: "Salmón fresco", price: 18.50 },
      { id: "p3", name: "Filete de res", desc: "Corte premium", price: 22.00 }
    ],
    ensaladas: [
      { id: "e1", name: "César", desc: "Lechuga y parmesano", price: 8.00 },
      { id: "e2", name: "Griega", desc: "Tomate y feta", price: 8.50 },
      { id: "e3", name: "Quinoa", desc: "Quinoa y vegetales", price: 12.00 }
    ],
    postres: [
      { id: "d1", name: "Flan", desc: "Flan de vainilla", price: 5.50 },
      { id: "d2", name: "Tiramisu", desc: "Postre italiano", price: 8.50 }
    ]
  },
  basic: {
    platos: [
      { id: "p1", name: "Pollo a la plancha", desc: "Pollo con especias", price: 12.50 }
    ],
    ensaladas: [
      { id: "e1", name: "César", desc: "Lechuga y parmesano", price: 8.00 }
    ],
    postres: [
      { id: "d1", name: "Flan", desc: "Flan de vainilla", price: 5.50 }
    ]
  }
};

export const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];