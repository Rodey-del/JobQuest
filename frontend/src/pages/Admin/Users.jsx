import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../../style/adminNav.css";
import {
  getAllUsersForAdminApi,
  getUserbyId,
} from "../../api/api";
import Modal from "react-modal";
import { toast } from "react-toastify";
import AdminLayout from "../../components/AdminLayout";

const AddUsers = () => {
  // get user id form local storage
  const user = JSON.parse(localStorage.getItem("user"));

  const [showTable, setShowTable] = useState(true);

  const [usersList, setusersList] = useState([]);
  const [sortOrder, setSortOrder] = useState({ column: null, asc: true });

  // Fetch all users from the API
  // =============================important part as this part makes the API Request and fetches the data from the backend ===============
  //
  useEffect(() => {
    getAllUsersForAdminApi()
      .then((res) => {
        if (res.data && res.data.users) {
          // Add dynamic IDs to each user
          const usersWithDynamicIds = res.data.users.map((user, index) => ({
            ...user,
            dynamicId: index + 1,
          }));
          
          setusersList(usersWithDynamicIds);
        } else {
          console.error("Invalid API response:", res);
        }
      })
      .catch((err) => {
        console.error("API request failed:", err);
      });
    //   getJobsByuserIdApi(user._id)

  }, []);

  //
  // ========= end of calling the Api ===========

  const getColumnName = (columnIndex) => {
    const columnNames = ["id", "image", "name", "email", "phone", "address", "status",];
    return columnNames[columnIndex];
  };

  const sortTable = (columnIndex) => {
    const columnName = getColumnName(columnIndex);
    const isAscending = sortOrder.column === columnName ? !sortOrder.asc : true;

    const sortedData = [...usersList].sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];

      if (valueA === undefined || valueB === undefined) {
        return isAscending ? -1 : 1;
      }

      const compareValueA =
        typeof valueA === "number" ? valueA : valueA.toString().toLowerCase();
      const compareValueB =
        typeof valueB === "number" ? valueB : valueB.toString().toLowerCase();

      if (isAscending) {
        return compareValueA < compareValueB ? -1 : 1;
      } else {
        return compareValueA > compareValueB ? -1 : 1;
      }
    });

    setusersList(sortedData);
    setSortOrder({ column: columnName, asc: isAscending });
  };

  // code for pagination
  // important part of the pagination

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = usersList.slice(indexOfFirstItem, indexOfLastItem);
  const pageNumbers = Math.ceil(usersList.length / itemsPerPage);

  const renderPaginationControls = () => {
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < pageNumbers;

    return (
      <div className="flex items-center mt-4">
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
          }
          className={`mr-2 px-3 py-1 rounded ${canGoPrevious
            ? "bg-green-500 text-white"
            : "bg-gray-300 text-gray-700"
            }`}
          disabled={!canGoPrevious}
        >
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        {Array.from({ length: pageNumbers }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={`mr-2 px-3 py-1 rounded ${currentPage === index + 1
              ? "bg-blue-500 text-white"
              : "bg-gray-300 text-gray-700"
              }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() =>
            setCurrentPage((prevPage) => Math.min(prevPage + 1, pageNumbers))
          }
          className={`ml-2 px-3 py-1 rounded ${canGoNext ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
            }`}
          disabled={!canGoNext}
        >
          <i class="fa-solid fa-arrow-right"></i>
        </button>
        <span className="ml-4">
          Page {currentPage} of {pageNumbers}
        </span>
      </div>
    );
  };

  //
  // end of the pagination code
  // =====================================================================================================================


  // code to display the table in same screens
  const renderTable = () => {
    if (!usersList || usersList.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <span className="text-2xl">No users found</span>
        </div>
      );
    }

    return (
      <div>
        <table className="min-w-full bg-white border border-gray-300 rounded-2">
          <thead>
            <tr>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(0)}
              >
                ID {sortOrder.column === "id" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer">Image</th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(1)}
              >
                Name{" "}
                {sortOrder.column === "name" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th className="py-2 px-4 border-b cursor-pointer">
                Email{" "}
                {sortOrder.column === "email" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(3)}
              >
                Phone{" "}
                {sortOrder.column === "phone" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(4)}
              >
                Address{" "}
                {sortOrder.column === "address" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(4)}
              >
                Role{" "}
                {sortOrder.column === "status" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              <th
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => sortTable(4)}
              >
                Status{" "}
                {sortOrder.column === "status" && (sortOrder.asc ? "↑" : "↓")}
              </th>
              {/* {user && user.isSuperAdmin ? null : ( */}
              {/* <th className="py-2 px-4 border-b cursor-pointer">Action</th> */}
              {/* )} */}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row) => (
              <tr key={row._id}>
                <td className="py-2 px-4 border-b text-center">
                  {row.dynamicId}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  <img src={row.image} width={30} alt="" />
                </td>
                <td className="py-2 px-4 border-b text-left">
                  {row.firstName + " " + row.lastName}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.email}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.phone}
                </td>
                <td className="py-2 px-4 border-b text-center">
                  {row.address}
                </td>
            
                <td className="py-2 px-4 border-b text-center">
                  {row.isSuperAdmin ? (
                    <button className="bg-blue-700 w-[130px] p-2 rounded-md text-white">Admin</button>
                  ) : row.isAdmin ? (
                    <button className="bg-blue-500 w-[130px] p-2 rounded-md text-white">Employer</button>
                  ) : (
                    <button className="bg-red-600 w-[130px] p-2 rounded-md text-white">User</button>
                  )}
                </td>




                <td className="py-2 px-4 border-b text-center">
                  {row.isVerified ? <><button className="bg-green-500 w-[130px] p-2  rounded-md text-white"> Verified</button></> : <><button className="bg-red-600 w-[130px] p-2  rounded-md text-white"> Not Verified</button></>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-center items-center">
          {renderPaginationControls()}
        </div>
      </div>
    );
  };
  //
  //  end of the code to render the table in the same screen
  // =====================================================================================================================

  // modal pop off code
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [userDetails, setUserDetails] = useState(null);

  const alertDescription = (id) => {
    getUserbyId(id)
      .then((res) => {
        console.log(res.data.users);
        setUserDetails(res.data.users);
        openModal(); // Open the modal
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <AdminLayout>
        <div className="main-content flex-1 bg-white mt-10 md:mt-2 pb-24 md:pb-5 ">
          <div className="bg-gray-800 pt-30">
            <div class="rounded-tl-3xl bg-gradient-to-r from-blue-900 to-green-800 p-4 shadow text-2xl text-white ">
              <h3 className="font-bold pl-2">Users</h3>
            </div>
          </div>

          {showTable ? (
            <>
              
              <div className="container mx-auto p-4 mt-20">
                <div className="overflow-x-auto">{renderTable()}</div>
              </div>
            </>
          ) : (
            <>
              <button
                className="bg-green-500 text-white py-2 px-4 rounded absolute mt-5 right-10 z-10"
                onClick={() => setShowTable(true)}
              >
                <i class="fa-regular fa-circle-xmark"></i>
              </button>

            </>
          )}
        </div>
      </AdminLayout>



    </>
  );
};

export default AddUsers;
