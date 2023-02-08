import {useEffect, useState} from 'react';
import {postQuery} from '../helpers/postQueries';
import { InsertModalMachineTypes } from './InsertModalMachineTypes';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

export const MachineTypes = () => {

    const [type, setType] = useState([]);

    const getTypes = async() => {
        const {machineType} = await postQuery({
            query: `query show_types {
                machineType {
                  name
                }
              }`
        });
        setType(machineType);
    }

    useEffect(() => {
        getTypes();
    }, [])

    const delType = async(name) => {
        const result = await postQuery({
            query: `mutation del_type {
                delete_machineType(where: {name: {_eq: "${name}"}}){
                  affected_rows
                }
              }`
        });
        if (result && result.delete_machineType.affected_rows === 1){
            const newTypeList = type.filter( element => element.name !== name );
            setType(newTypeList);
        }else{
            Swal.fire('Delete error', 'There was an error deleting that record', 'There was an error deleting that record');
        }
    }

    return (
        <>
            <h3 style={{margin: "50px 0px 0px"}}>Machine Types</h3>
            <InsertModalMachineTypes getTypes={getTypes} />
            <div>
                {
                    <table align='center' width='100%'>
                        <thead>
                            <tr>
                                <th> Name </th>
                                <th> Delete </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                type.map( type => (
                                    <tr key={type.name}>
                                        <td> {type.name} </td>
                                        <td>
                                            <button onClick={() => delType(type.name)} type="button">Delete</button>
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
