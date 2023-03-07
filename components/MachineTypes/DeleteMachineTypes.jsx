export const DeleteMachineTypes = ({name, deleted, delType, token, defaultRole}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delType(name, deleted, token, defaultRole)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delType(name, deleted, token, defaultRole)} type="button">Delete</button>
            </td>
        )
    }
}
