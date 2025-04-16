// 'use client'
// import React, {  useEffect, useState } from 'react'
// import axios from 'axios'
// import SideBar from "../../../components/SideBar.jsx"  
// // import './UserList.css'
// import { jwtDecode } from 'jwt-decode'

// function UserList() {
//   const token = localStorage.getItem('token')
//   const [userList, setUserList] = useState([])
//   const [search, setsearch] = useState('')

//   if (!token||jwtDecode(token).role !== 'admin') {
//     window.location.href = '/'
//   }

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('http://localhost:3000/api/user', {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       setUserList(response.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   useEffect(() => {
//     fetchUsers()
//   }, [])

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://localhost:3000/api/user/${id}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       fetchUsers()
//     } catch (error) {
//       console.log(error)
//     }
//   }
//   const [status, setStatus] = useState('')

//   const handleEdit = async (id, statuss) => {
//     if (statuss === 'active') {
//       setStatus('banned')
//     } else {
//       setStatus('active')
//     }

//     try {
//       const response = await axios.put(`http://localhost:3000/api/user/${id}`, { status:status }, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//       fetchUsers()
//       console.log(response.data.user.status)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   return (
//     <>
//     <div className='sidebar' >
//       <SideBar />
//     </div>
//       <div className="userlist-container">
//         <h1 className="userlist-title">User List</h1>
//         <div className='search-bar'>
//           <input type="text" placeholder='search'  onChange={(e)=>setsearch(e.target.value)} />
//         </div>
//         <table className="userlist-table">
//           <thead>
//             <tr>
//               <th className="userlist-header">ID</th>
//               <th className="userlist-header">Name</th>
//               <th className="userlist-header">Email</th>
//               <th className="userlist-header">Role</th>
//               <th className="userlist-header">Status</th>
//               <th className="userlist-header">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {userList.sort((a, b) => a.role.localeCompare(b.role)).filter((e)=>e.name.toLowerCase().includes(search.toLowerCase())).map(user => (
//               <tr key={user.id} className="userlist-row">
//                 <td className="userlist-cell">{user.id}</td>
//                 <td className="userlist-cell">{user.name}</td>
//                 <td className="userlist-cell">{user.email}</td>
//                 <td className="userlist-cell">{user.role}</td>
//                 <td className="userlist-cell">{user.status}</td>
//                 <td className="userlist-actions">
//                   <button className="delete-btn" onClick={() => handleDelete(user.id)}>Delete</button>
//                   <button className="edit-btn" onClick={() => handleEdit(user.id,user.status)}>
//                     {user.status === 'active' ? "Ban" : "Unban"}
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   )
// }

// export default UserList
"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import SideBar from "../../../components/SideBar.jsx"
import { jwtDecode } from 'jwt-decode'

function UserList() {
  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null
  const [userList, setUserList] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (!token || jwtDecode(token).role !== 'admin') {
      window.location.href = '/'
    } else {
      fetchUsers()
    }
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setUserList(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchUsers()
    } catch (error) {
      console.error(error)
    }
  }

  const handleEdit = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active'
    setStatus(newStatus)
    try {
      await axios.put(`http://localhost:3000/api/user/${id}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchUsers()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex">
     

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6">User List</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name"
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded shadow-md">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="text-left py-3 px-4">ID</th>
                <th className="text-left py-3 px-4">Name</th>
                <th className="text-left py-3 px-4">Email</th>
                <th className="text-left py-3 px-4">Role</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList
                .sort((a, b) => a.role.localeCompare(b.role))
                .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
                .map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{user.id}</td>
                    <td className="py-2 px-4">{user.name}</td>
                    <td className="py-2 px-4">{user.email}</td>
                    <td className="py-2 px-4">{user.role}</td>
                    <td className="py-2 px-4">{user.status}</td>
                    <td className="py-2 px-4 space-x-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                        onClick={() => handleEdit(user.id, user.status)}
                      >
                        {user.status === 'active' ? 'Ban' : 'Unban'}
                      </button>
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ✅ This is important: Make sure you're exporting a default React component
export default UserList

