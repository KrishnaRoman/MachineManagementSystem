export const DeleteMachines = ({id, deleted, delMachine}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delMachine(id, deleted)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delMachine(id, deleted)} type="button">Delete</button>
            </td>
        )
    }   
}
