import React, {  useEffect, useState } from 'react'
import axios from 'axios'
import SideBar from './SideBar'
import './UserList.css'
import { jwtDecode } from 'jwt-decode'

function UserList() {
  const token = localStorage.getItem('token')
  const [userList, setUserList] = useState([])
  const [search, setsearch] = useState('')

  if (!token||jwtDecode(token).role !== 'admin') {
    window.location.href = '/'
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setUserList(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      fetchUsers()
    } catch (error) {
      console.log(error)
    }
  }
  const [status, setStatus] = useState('')

  const handleEdit = async (id, statuss) => {
    if (statuss === 'active') {
      setStatus('banned')
    } else {
      setStatus('active')
    }

    try {
      const response = await axios.put(`http://localhost:3000/api/user/${id}`, { status:status }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      fetchUsers()
      console.log(response.data.user.status)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
    <div className='sidebar' >
      <SideBar />
    </div>
      <div className="userlist-container">
        <h1 className="userlist-title">User List</h1>
        <div className='search-bar'>
          <input type="text" placeholder='search'  onChange={(e)=>setsearch(e.target.value)} />
        </div>
        <table className="userlist-table">
          <thead>
            <tr>
              <th className="userlist-header">ID</th>
              <th className="userlist-header">Name</th>
              <th className="userlist-header">Email</th>
              <th className="userlist-header">Role</th>
              <th className="userlist-header">Status</th>
              <th className="userlist-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userList.sort((a, b) => a.role.localeCompare(b.role)).filter((e)=>e.name.toLowerCase().includes(search.toLowerCase())).map(user => (
              <tr key={user.id} className="userlist-row">
                <td className="userlist-cell">{user.id}</td>
                <td className="userlist-cell">{user.name}</td>
                <td className="userlist-cell">{user.email}</td>
                <td className="userlist-cell">{user.role}</td>
                <td className="userlist-cell">{user.status}</td>
                <td className="userlist-actions">
                  <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
                  <button className="edit-btn" onClick={() => handleEdit(user.id,user.status)}>
                    {user.status === 'active' ? "Ban" : "Unban"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default UserList
