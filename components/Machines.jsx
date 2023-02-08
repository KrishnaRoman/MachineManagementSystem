import {useEffect, useState} from 'react';
import {postQuery} from '../helpers/postQueries';
import { InsertModalMachines } from './InsertModalMachines';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const Machines = () => {

    const [machine, setMachine] = useState([]);

    const getMachines = async() => {
        const {machines} = await postQuery({
            query: `query show_machine {
                machines {
                  id
                  location
                  operationStartDate
                  type
                }
              }`
        });
        setMachine(machines);
    }

    useEffect(() => {
        getMachines();
    }, [])

    const delMachine = async(id) => {
        const result = await postQuery({
            query: `mutation del_machine {
                delete_machines(where: {id: {_eq: ${id}}}){
                  affected_rows
                }
              }`
        });
        if (result && result.delete_machines.affected_rows === 1){
            const newMachineList = machine.filter( element => element.id !== id );
            setMachine(newMachineList);
        }else{
            Swal.fire('Delete error', 'There was an error deleting that record', 'There was an error deleting that record');
        }

    }

    return (
        <>
            <h3>Machines</h3>
            <InsertModalMachines getMachines={getMachines} />
            <div>
                {
                    <table align="center" width="100%">
                        <thead>
                            <tr>
                                <th> Id </th>
                                <th> Type </th>
                                <th> Location </th>
                                <th> OperationStartDate </th>
                                <th> Delete </th>
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
                                        <td>
                                            <button onClick={() => delMachine(machine.id)} type="button">Delete</button>
                                        </td>
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
