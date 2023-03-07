export const DeleteUser = ({id, deleted, delUser, token, defaultRole}) => {
    
    if (deleted){
        return (
            <td>
                <button onClick={() => delUser(id, deleted, token, defaultRole)} type="button">Restore</button>
            </td>
        )
    }else{
        return (
            <td>
                <button onClick={() => delUser(id, deleted, token, defaultRole)} type="button">Delete</button>
            </td>
        )
    }   
}
