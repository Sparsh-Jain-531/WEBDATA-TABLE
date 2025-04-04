import React, { useState, useEffect, useRef, Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageNotFound from "../../components/ImageNotFound/ImageNotFound";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

import FindDuplicate from "./FindDuplicate";
import DuplicatesData from "./DuplicateData";
import EditDuplicateData from "./EditDuplicateData";
import DuplicateImage from "./DuplicateImage";
import Loader from "../../components/Loader/Loader";
import { checkMappedDataExits } from "../../services/common";

const ImageScanner = () => {
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [duplicatesData, setDuplicatesData] = useState([]);
  const [showDuplicates, setShowDuplicates] = useState(true);
  const [showDuplicateField, setShowDuplicateField] = useState(false);
  const [columnName, setColumnName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentRowData, setCurrentRowData] = useState(null);
  const [allCurrentData, setAllCurrentData] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [modifiedKeys, setModifiedKeys] = useState({});
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("userData"));
  let { fileId } = JSON.parse(localStorage.getItem("fileId")) || "";
  let imageNames = JSON.parse(localStorage.getItem("imageName")) || "";
  const { id } = useParams();
  const cancelButtonRef = useRef(null);
  const navigate = useNavigate();

  const [duplicateCheckedData, setDuplicateCheckedData] = useState([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       // Make a GET request to the backend to get the CSV headers
  //       const response = await axios.get(
  //         // The URL of the backend endpoint
  //         `${window.SERVER_IP}/get/headerdata/${fileId}`,
  //         // The headers to send with the request
  //         {
  //           headers: {
  //             // The token to authenticate the request
  //             token: token,
  //           },
  //         }
  //       );
  //       // Set the state of the CSV headers to the response from the backend
  //       setCsvHeaders(response.data.headers);
  //     } catch (error) {
  //       // Log any errors to the console
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [fileId, token]);

  const onUpdateCurrentDataHandler = async () => {
    try {
      await axios.post(
        `${window.SERVER_IP}/update/duplicatedata`,
        {
          id: currentRowData?.id,
          fileID: fileId,
          rowData: currentRowData,
        },
        {
          headers: {
            token: token,
          },
        }
      );
      toast.success("The row has been updated successfully.");
      setEditModal(false);
    } catch (error) {
      toast.error("Unable to update the row data!");
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" && currentImageIndex > 0) {
        setCurrentImageIndex(currentImageIndex - 1);
        setImageUrl(currentRowData.imagePaths[currentImageIndex - 1]);
      } else if (
        event.key === "ArrowRight" &&
        currentImageIndex < currentRowData?.imagePaths.length - 1
      ) {
        setCurrentImageIndex(currentImageIndex + 1);
        setImageUrl(currentRowData.imagePaths[currentImageIndex + 1]);
      } else if (event.altKey && event.key === "s") {
        // Ensure currentRowData is not null before updating
        if (currentRowData) {
          onUpdateCurrentDataHandler();
        } else {
          console.error("currentRowData is null when trying to update.");
        }
      } else if (event.ctrlKey && event.key === "ArrowLeft") {
        if (editModal) {
          setEditModal(false);
        } else if (!showDuplicates) {
          setShowDuplicates(true);
        }
        setShowDuplicateField(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentImageIndex, currentRowData, onUpdateCurrentDataHandler]);

  const changeCurrentCsvDataHandler = (key, value) => {
    setCurrentRowData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const onFindDuplicatesHandler = async (columnName) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${window.SERVER_IP}/duplicate/data`,
        {
          colName: columnName,
          fileID: fileId,
          imageColumnName: imageNames,
        },
        {
          headers: {
            token: token,
          },
        }
      );

      if (response.data?.message) {
        toast.success(response.data?.message);
        // setCurrentRowData(response.data?.duplicates[0]);
        // setImageUrl(url);
        setColumnName(columnName);
        setDuplicatesData(response.data?.duplicates);
        setShowDuplicates(false);
        return;
      }

      // const url = response.data?.duplicates[0].imagePaths[currentImageIndex];

      setShowDuplicates(false);
      toast.success("Successfully fetched all duplicates data!");
    } catch (error) {
      console.log(error);
      toast.warning(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const onRemoveDuplicateHandler = async (index, rowIndex, colName) => {
    const currentData = [...allCurrentData];
    const allDuplicateData = [...duplicatesData];

    const filteredData = currentData.filter((item) => item.index !== rowIndex);

    function removeItemByRowIndex(dataArray, rowIndex) {
      return dataArray
        .map((group) => {
          return {
            sameData: group.sameData.filter((item) => item.index !== rowIndex),
          };
        })
        .filter((group) => group.sameData.length > 0);
    }
    const updatedData = removeItemByRowIndex(allDuplicateData, rowIndex);

    if (currentData.length === 1) {
      toast.warning("Removing the row is not permitted.");
      return;
    }

    try {
      await axios.post(
        `${window.SERVER_IP}/delete/duplicate`,
        { index: parseInt(rowIndex), fileID: fileId },
        {
          headers: {
            token: token,
          },
        }
      );

      filteredData.forEach((data) => {
        if (data.index > rowIndex) {
          data.index -= 1;
        }
      });
      setAllCurrentData(filteredData);
      setDuplicatesData(updatedData);
      toast.success("Row Deleted successfully!");
    } catch (error) {
      console.log(error);
    }
  };

  const onEditModalHandler = async (id) => {
    const response = await axios.get(
      `${window.SERVER_IP}/get/csvRowData?rowId=${id}&fileId=${fileId}`,

      {
        headers: {
          token: token,
        },
      }
    );
    console.log(response.data.rowData);

    setCurrentRowData(response.data.rowData);
    setEditModal(true);
    setImageUrl(response.data.imageUrl);
  };
  const onShowModalHandler = async (data, _, columnName) => {
    const fileId = await JSON.parse(localStorage.getItem("fileId"));
    const obj = {
      fileId: fileId.fileId,
      columnName: columnName,
      value: data[columnName],
    };

    const response = await axios.post(
      `${window.SERVER_IP}/get/duplicate/data`,
      obj,
      {
        headers: {
          token: token,
        },
      }
    );

    console.log(response.data.data);

    setAllCurrentData(response.data.data);
    setShowDuplicateField(true);
  };

  const onDuplicateCheckedHandler = async () => {
    try {
      const data = await JSON.parse(localStorage.getItem("fileId"));
      const response = await checkMappedDataExits(data?.templeteId);
      setDuplicateCheckedData(response);
      if (response?.success) {
        navigate(`/csvuploader/templatemap/${id}`);
      } else {
        // toast.error("Cannot move to mapped page!!")
      }
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <div className="flex duplicateImg  bg-gradient-to-r from-blue-400 to-blue-600 border-1 justify-center items-center">
          {showDuplicates ? (
            <FindDuplicate
              onDuplicateCheckedHandler={onDuplicateCheckedHandler}
              csvHeaders={csvHeaders}
              imageNames={imageNames}
              onFindDuplicatesHandler={onFindDuplicatesHandler}
              loading={loading}
              duplicateCheckedData={duplicateCheckedData}
            />
          ) : (
            <div className="flex flex-col w-full justify-center items-center lg:items-start lg:flex-row pt-20  ">
              {/* LEFT SECTION  */}
              <div className="flex w-full my-2 lg:my-7 lg:w-[30%] xl:w-[25%] ">
                <div className="text-center sm:block sm:p-0 w-full">
                  {!editModal ? (
                    <DuplicatesData
                      duplicatesData={duplicatesData}
                      columnName={columnName}
                      onShowModalHandler={onShowModalHandler}
                      showDuplicateField={showDuplicateField}
                      cancelButtonRef={cancelButtonRef}
                      setShowDuplicateField={setShowDuplicateField}
                      allCurrentData={allCurrentData}
                      onEditModalHandler={onEditModalHandler}
                      onRemoveDuplicateHandler={onRemoveDuplicateHandler}
                    />
                  ) : (
                    <EditDuplicateData
                      currentRowData={currentRowData}
                      imageNames={imageNames}
                      changeCurrentCsvDataHandler={changeCurrentCsvDataHandler}
                      setEditModal={setEditModal}
                      onUpdateCurrentDataHandler={onUpdateCurrentDataHandler}
                    />
                  )}
                </div>
              </div>

              {/* RIGHT SECTION  */}
              {!imageUrl ? (
                <div className="flex lg:w-[70%] xl:w-[75%] justify-center items-center ">
                  <div className="">
                    <ImageNotFound />

                    <h1 className="mt-8 text-2xl font-bold tracking-tight text-gray-700 sm:text-4xl">
                      Please Select Image...
                    </h1>

                    <p className="mt-4 text-gray-600 text-center">
                      We can't find that page!!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-[75%]">
                  <DuplicateImage
                    currentImageIndex={currentImageIndex}
                    currentRowData={currentRowData}
                    imageUrl={imageUrl}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default ImageScanner;
