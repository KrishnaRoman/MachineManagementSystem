import { useNavigate } from 'react-router-dom';

import {Machines} from '../components/Machines/Machines';
import { MachineTypes } from '../components/MachineTypes/MachineTypes';
import { Record } from '../components/Record/Record';
import { Maintenances } from '../components/Maintenances/Maintenances';
import { Users } from '../components/Users/Users';

export const getLocalVariable = (variableName) => {
    const result = localStorage.getItem(variableName);
    return result
};

export const FirstApp = () => {

    let navigate = useNavigate();

    const token = getLocalVariable('token');
    // const allowedRoles = getLocalVariable('allowed_roles').split(",");
    const defaultRole = getLocalVariable('default_role');
    const username = getLocalVariable('username');
    // allowedRoles.push(getLocalVariable('default_role'));

    // const userRoles = allowedRoles.map(role => {
    //     if(role === "admin"){
    //         return "  Admin"
    //     }else if(role === "admin_jr_1"){
    //         return "  Admin Jr 1"
    //     }else if(role === "admin_jr_2"){
    //         return "  Admin Jr 2"
    //     }else if(role === "manager"){
    //         return "  Manager"
    //     }else if(role === "reporter"){
    //         return "  Reporter"
    //     }
    // })

    const handleLogout = () => {
        console.log("logued out");
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('default_role')
        return navigate("/")
    }

    // - Admin: Acceso de lectura, escritura a todas las tablas.
    // - Admin Jr 1: Acceso de lectura, escritura a las tablas users y manager.
    // - Admin Jr 2: Acceso de lectura, escritura a las tablas machines y machineType.
    // - Manager: Acceso de lectura, escritura a las tablas controlMaintenanceRecord y maintenances.
    // - Reporter: Acceso de lectura a todas las tablas.

    return (
    <>
        <div className='TitleApp'>
            <h1>Machine Managment System</h1>
            <button onClick={handleLogout}>Logout</button>
        </div> 
        <div>User: {username}</div>
        <div>Roles: {defaultRole}</div>
        {/* <Users token={token} canWrite={allowedRoles.includes("admin") || allowedRoles.includes("admin_jr_1")}/>
        <Machines token={token} canWrite={allowedRoles.includes("admin") || allowedRoles.includes("admin_jr_2")}/>
        <MachineTypes  token={token} canWrite={allowedRoles.includes("admin") || allowedRoles.includes("admin_jr_2")}/>
        <Record  token={token} canWrite={allowedRoles.includes("admin") || allowedRoles.includes("manager")}/>
        <Maintenances  token={token} canWrite={allowedRoles.includes("admin") || allowedRoles.includes("manager")}/> */}

        {
            (defaultRole === "admin" || defaultRole === "admin_jr_1" || defaultRole === "reporter") ? <Users token={token} defaultRole={defaultRole}/> : ''
        }
        {
            (defaultRole === "admin" || defaultRole === "admin_jr_2" || defaultRole === "reporter") ? 
            <>
                <Machines token={token} defaultRole={defaultRole}/>
                <MachineTypes  token={token} defaultRole={defaultRole}/>
            </> : ''
        }
        {
            (defaultRole === "admin" || defaultRole === "manager" || defaultRole === "reporter") ? 
            <>
                <Record  token={token} defaultRole={defaultRole}/>
                <Maintenances  token={token} defaultRole={defaultRole}/>
            </> : ''
        }
        
    </>
    )
}