export const DeleteMachines = ({id, deleted, delMachine, token, defaultRole}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMachine(id, deleted, token, defaultRole)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMachine(id, deleted, token, defaultRole)} type="button">Delete</button>
            </td>
        )
    }   
}
