export const DeleteMachines = ({id, deleted, delMachine, token}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMachine(id, deleted, token)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMachine(id, deleted, token)} type="button">Delete</button>
            </td>
        )
    }   
}
