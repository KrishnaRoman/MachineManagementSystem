import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';
import { InsertModalMachines } from './InsertModalMachines';

import 'sweetalert2/dist/sweetalert2.min.css';
import { DeleteMachines } from './DeleteMachines';

export const Machines = ({token, defaultRole}) => {

    const canWrite = defaultRole === 'admin_jr_2' || defaultRole === 'admin';
    const [deleted, setDeleted] = useState(false);
    const [machine, setMachine] = useState([]);
    const [insertMachine, setInsertMachine] = useState(false);

    const getMachines = async() => {
        const response = await postQuery({
            query: `query show_machine {
                machines(order_by: {id: asc}, where: {deleted: {_eq: ${deleted}}}) {
                  id
                  location
                  operationStartDate
                  type
                  deleted
                }
              }`
        },
        token,
        defaultRole);
        setMachine(response?.machines || []);
    }

    useEffect(() => {
        getMachines();
    }, [deleted])

    const delMachine = async(id, deleted, token) => {
        const result = await postQuery({
            query: `mutation toggleMachines {
            update_machines(where: {id: {_eq: ${id}}}, _set: {deleted: ${!deleted}}) {
                    affected_rows
                }
            }`
        },
        token,
        defaultRole);
        const newMachineList = machine.filter( element => element.id !== id );
        setMachine(newMachineList);
    }

    const handleDeleted = () => {
        setDeleted(!deleted)
    }

    return (
        <>
            <h3>Machines</h3>
            {
              canWrite ? <button onClick={ () => { setInsertMachine(!insertMachine)} } type="button">Add</button> : ''
            }
            {
                insertMachine ? <InsertModalMachines getMachines={getMachines} token={token} insertMachine={insertMachine} setInsertMachine={setInsertMachine} defaultRole={defaultRole}/> : ''
            }
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted}/>
            <div>
                {
                    <table align="center" width="100%">
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> Type </th>
                                <th> Location </th>
                                <th> OperationStartDate </th>
                                {
                                    canWrite ? <th> Delete </th> : ''
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                machine.map( machine => (
                                    <tr key={machine.id}>
                                        <td> {machine.id} </td>
                                        <td> {machine.type} </td>
                                        <td> {machine.location} </td>
                                        <td> {machine.operationStartDate} </td>
                                        {
                                            canWrite ? <DeleteMachines id={machine.id} deleted={machine.deleted} delMachine={delMachine} token={token} defaultRole={defaultRole}/> : ''
                                        }
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                }
            </div>
        </>
    )
}
