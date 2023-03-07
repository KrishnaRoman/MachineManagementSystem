export const DeleteMachineTypes = ({name, deleted, delType, token}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delType(name, deleted, token)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delType(name, deleted, token)} type="button">Delete</button>
            </td>
        )
    }
}
