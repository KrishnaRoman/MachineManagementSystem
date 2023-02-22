export const DeleteMachineTypes = ({name, deleted, delType}) => {
    if (deleted){
        return (
            <td>
                <button onClick={() => delType(name, deleted)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delType(name, deleted)} type="button">Delete</button>
            </td>
        )
    }
}
