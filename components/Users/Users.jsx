import {useEffect, useState} from 'react';
import {postQuery} from '../../helpers/postQueries';

//import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { InsertModalUsers } from './InsertModalUsers';
import { DeleteUser } from './DeleteRecord';

export const Users = ({token, defaultRole}) => {

    const canWrite = defaultRole === 'admin_jr_1' || defaultRole === 'admin';
    const [users, setUsers] = useState([]);
    const [insertUsers, setInsertUsers] = useState(false);
    const [deleted, setDeleted] = useState(false);

    const getUsers = async() => {
      const response = await postQuery({
          query: `query get_users {
              user(order_by: {default_role: asc}, where: {deleted: {_eq: ${deleted}}}) {
                id
                username
                email
                phone
                default_role
                deleted
              }
            }`
      },
      token,
      defaultRole);
      setUsers(response?.user || []);
    }

    const delUser = async(id, deleted) => {
        const result = await postQuery({
            query: `mutation toggleUser {
                update_user(where: {id: {_eq: "${id}"}}, _set: {deleted: ${!deleted}}) {
                  affected_rows
                }
              }`
        },
        token,
        defaultRole);
        const newUserList = users.filter( element => element.id !== id);
        setUsers(newUserList);
    }

    const handleDeleted = () => {
        setDeleted(!deleted)
    }

    useEffect(() => {
      getUsers();
    }, [deleted])

    return (
        <>
            <h3 style={{margin: "25px 0px 0px"}}>Usuarios</h3>
            {
              canWrite ? <button onClick={ () => { setInsertUsers(!insertUsers)} } type="button">Add</button> : ''
            }
            {
                insertUsers ? <InsertModalUsers insertUsers={insertUsers} setInsertUsers={setInsertUsers} getUsers={getUsers} defaultRole={defaultRole}/> : ''
            }
            <label> Deleted </label>
            <input type="checkbox" checked={deleted} onChange={handleDeleted}/>
            <table align='center' width='100%'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Default Role</th>
                  {
                      canWrite ? <th> Delete </th> : ''
                  }
                </tr>
              </thead>
              <tbody>
                {users.map((val, key) => {
                  return (
                    <tr key={key}>
                      <td>{val.username}</td>
                      <td>{val.email}</td>
                      <td>{val.phone}</td>
                      <td>{val.default_role}</td>
                      {
                          canWrite ? <DeleteUser id={val.id} deleted={val.deleted} delUser={delUser} token={token} defaultRole={defaultRole}/> : ''
                      }
                    </tr>
                  )
                })}
              </tbody>
            </table>
        </>
    )
}
