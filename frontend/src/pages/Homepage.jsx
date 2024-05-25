import React, { useEffect, useState } from "react";
import image from "../images/logos/jobportal .png";

import "../style/homepage.css";
import {
  getAllJobsApi,
  getAllJobsNearMeApi,
  getAllJobsWithoutSavedApi,
  getFilteredJobsApi,
  postLikedJobsApi,
} from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { debounce } from "lodash";

const HomePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(true);
  const [favoritedJobs, setFavoritedJobs] = useState([]);
  const [jobItems, setJobItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleHeartClick = async (jobId) => {
    if (!user) {
      openModal();
      return;
    }

    try {
      // Send the liked job to the backend
      const formData = new FormData();
      formData.append("userId", user._id);
      formData.append("likedJobsId", jobId);

      const response = await postLikedJobsApi(formData);
      if (response.data.success === false) {
        toast.error(response.data.message);
      } else {
        toast.success(response.data.message);
        getAllJobsWithoutSavedApi(user._id)
          .then((res) => {
            setJobItems(res.data.jobs); // Update jobItems state with the updated list of jobs
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
      console.log("Liked job sent to backend:", response.data);
    } catch (error) {
      console.error("Error sending liked job to backend:", error.message);
    }

    // Update the favoritedJobs state with the new liked job
    setFavoritedJobs([...favoritedJobs, jobId]);
  };



  const handleOk = () => {
    closeModal();
    navigate("/login");
  };



  useEffect(() => {
    if (user == null) {
      getAllJobsApi()
        .then((res) => {
          setJobItems(res.data.jobs);
          setLoading(false);
          // console.log(res.data.jobs);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });

    }
    else {
      getAllJobsWithoutSavedApi(user._id)
        .then((res) => {
          setJobItems(res.data.jobs);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  }, []);

  //  get data of job near me
  const [jobsNearMe, setJobsNearMe] = useState([]);
  useEffect(() => {
    if (user == null) return;

    getAllJobsNearMeApi(user._id)
      .then((res) => {
        setJobsNearMe(res.data.jobs);
        setLoading(false);
        return;
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const [selectedJobTypes, setSelectedJobTypes] = useState([]);

  // const debouncedGetFilteredJobs = debounce(getFilteredJobsApi, 300); // Adjust the debounce delay as needed

  const handleJobTypeChange = (jobType) => {
    const updatedJobTypes = [...selectedJobTypes];

    if (updatedJobTypes.includes(jobType)) {
      const removedIndex = updatedJobTypes.indexOf(jobType);
      updatedJobTypes.splice(removedIndex, 1);
    } else {
      updatedJobTypes.push(jobType);
    }

    setSelectedJobTypes(updatedJobTypes);

    // Log the selected job types and make the API call
    console.log(updatedJobTypes);
    if (updatedJobTypes.length == 0) {
      return getAllJobsApi()
        .then((res) => {
          setJobItems(res.data.jobs);
          setLoading(false);
          // console.log(res.data.jobs);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
    getFilteredJobsApi(updatedJobTypes).then((res) => {
      setJobItems(res.data.jobs);
      setLoading(false);
    });
  };

  return (
    <div>
      <img className="dashboardimage" src={image} alt="DashBoardImage" />



      <div className="w-full flex">




        {showSidebar && (
          <div className="sidebar">
            <h2 className="text-xl font-semibold mb-4 ">Job Types</h2>
            {/* Step 3: Add checkboxes to select job types */}
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("fullTime")}
              />
              <span className="ml-2">Full Time</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("partTime")}
              />
              <span className="ml-2">Part Time</span>
            </label>
            <hr />
            <h2 className="text-xl font-semibold mb-4 mt-4">Work Type</h2>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("remote")}
              />
              <span className="ml-2">Remote</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("office")}
              />
              <span className="ml-2">Office</span>
            </label>
            <hr />
            <h2 className="text-xl font-semibold mb-4 mt-4">Education</h2>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("highSchool")}
              />
              <span className="ml-2">Highschool</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("bachelor")}
              />
              <span className="ml-2">Bachelor</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("master")}
              />
              <span className="ml-2">Master</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("any level")}
              />
              <span className="ml-2">Any Level</span>
            </label>
            <hr />
            <h2 className="text-xl font-semibold mb-4 mt-4">Experience</h2>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("entryLevel")}
              />
              <span className="ml-2">Entry</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("midLevel")}
              />
              <span className="ml-2">Mid</span>
            </label>
            <label className="block mb-2">
              <input
                type="checkbox"
                className="form-checkbox text-blue-800"
                onChange={() => handleJobTypeChange("seniorLevel")}
              />
              <span className="ml-2">Senior</span>
            </label>
            <hr />
          
          </div>

        )}

        <div className="w-5/6 justify-center">
          {!user ? null : jobsNearMe.length > 0 ? (
            <div className="w-full">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="w-full ">
                  <h3 className="text-2xl font-bold mb-2 ml-6 mt-4 text-blue-800">
                    Jobs Near You
                  </h3>
                  <div className="w-full flex-1 p-4 flex flex-wrap">
                    {jobsNearMe.slice(0, 4).map((job, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 sm:w-full md:w-2/5 flex p-4 m-2 justify-between items-center border rounded"
                      >
                        <div
                          className="flex w-4/5"
                          onClick={() => navigate(`/jobs/${job._id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="rounded mt-3 items-center ">

                            <img src={job.image} alt="" width={100} />

                          </div>

                          <div className="items-center flex-col pl-4">
                            <h3 className="text-xl items-left font-semibold ">
                              {job.jobTitle} -
                              <p className="text-sm text-red-600 text-transform: capitalize">
                                {job.jobType}
                              </p>
                            </h3>

                            <p>{` ${job.companyName}`}</p>

                            <p className="text-sm ">
                              {" "}
                              <i class="fa-solid fa-location-dot pr-1"></i> {job.location}
                            </p>
                  

                          </div>
                        </div>
                        <i
                          className={`fa-regular fa-heart ml-5${favoritedJobs.includes(job._id) ? "fas" : ""
                            }`}
                          onClick={() => handleHeartClick(job._id)}
                        ></i>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
          <div className="w-6/6">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                <h3 className="text-2xl font-bold mb-2 ml-6 mt-4  text-blue-800">
                  All Jobs
                </h3>
                <div className="w-full flex-1 p-4 flex flex-wrap">
                  {jobItems.slice(0, 14).map((job, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 sm:w-full md:w-2/5 flex p-4 m-2 justify-between items-center border rounded"
                    >
                      <div
                        className="flex w-4/5"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="rounded mt-3 items-center">
                          <img src={job.image} alt="" width={100} />
                        </div>
                        <div className="items-center flex-col  pl-4">
                          <h3 className="text-xl items-center font-semibold ">
                            {job.jobTitle} -
                            <p className="text-sm text-red-600 text-transform: capitalize">
                              {job.jobType}
                            </p>
                          </h3>
                          <p>{` ${job.companyName}`}</p>
                          <p className="text-sm ">
                              {" "}
                              <i class="fa-solid fa-location-dot pr-1"></i> {job.location}
                            </p>
                        </div>

                      </div>
                      <i
                        className={`fa-regular fa-heart ml-5 ${favoritedJobs.includes(job._id) ? "fas" : ""
                          }`}
                        onClick={() => handleHeartClick(job._id)}
                      ></i>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 grid place-items-center bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full"
            id="my-modal"
          >
            <div className="relative mx-auto p-5 border max-w-2xl w-4/5 shadow-lg rounded-md bg-white">
              {/* Close button */}
              <div className="absolute top-2 right-2 ">
                <button
                  onClick={closeModal}
                  className="text-black bg-gray-200 hover:bg-gray-300 rounded-lg text-sm "
                >
                  <i class="fa-solid fa-xmark p-2"></i>
                </button>
              </div>

              {/* Message and OK button */}
              <div className="text-center mt-5">
                <p className="text-lg mb-4">
                  Please login before continuing further.
                </p>
                <button
                  onClick={handleOk}
                  className="bg-red-500 w-1/5 text-white font-bold py-2 px-4 rounded"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;



