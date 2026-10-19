import { useState } from "react";
import { Login } from "./components/Login"; import { Sidebar } from "./components/Sidebar"; import { Dashboard } from "./components/Dashboard"; import { OrderDetail } from "./components/OrderDetail"; import { Simulation } from "./components/Simulation"; import { OrdersList } from "./components/OrdersList"; import { Administration } from "./components/Administration";
export type Screen = "dashboard" | "orders" | "simulation" | "order-detail" | "admin";
export default function App(){const saved=localStorage.getItem("fastfrete_session");const [session,setSession]=useState<any>(saved?JSON.parse(saved):null);const [screen,setScreen]=useState<Screen>("dashboard");const [orderId,setOrderId]=useState<number|null>(null);const navigate = (next: Screen, id?: number ) => {
  if (next === "order-detail" && id === undefined) {
    setOrderId(null);
  } else if (id !== undefined) {
    setOrderId(id);
  }

  setScreen(next);
};
if(!session)return <Login onLogin={setSession}/>;const logout=()=>{localStorage.removeItem("fastfrete_session");setSession(null);};return <div className="flex min-h-screen" style={{background:"#0D1117",fontFamily:"'Sora',system-ui,sans-serif"}}><Sidebar active={screen==="order-detail"?"orders":screen} onNavigate={navigate} onLogout={logout}/><main className="flex-1 flex flex-col overflow-hidden">{screen==="dashboard"&&<Dashboard onNavigate={navigate}/>} {screen==="orders"&&<OrdersList onNavigate={navigate}/>} {screen==="order-detail"&&<OrderDetail orderId={orderId} onNavigate={navigate}/>} {screen==="simulation"&&<Simulation onNavigate={navigate}/>} {screen==="admin"&&<Administration/>}</main></div>}
