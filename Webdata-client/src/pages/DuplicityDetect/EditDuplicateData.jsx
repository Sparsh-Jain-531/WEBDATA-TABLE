import React, { useState } from "react";

const EditDuplicateData = ({
  currentRowData,
  imageNames,
  changeCurrentCsvDataHandler,
  setEditModal,
  onUpdateCurrentDataHandler,
}) => {
  return (
    <div className="flex flex-row lg:flex-col justify-center items-center lg:w-[96%] lg:ms-3 lg:mt-5">
      <div className="mx-6 inline-block align-bottom lg:mt-2  bg-teal-100 rounded-xl  text-left shadow-md transform transition-all  sm:align-middle  w-[90%] lg:w-full">
        <div className="px-4 py-2 lg:py-3">
          <div className="sm:flex w-full">
            <div className="text-center  sm:text-left w-full">
              <div className=" font-semibold my-2 overflow-x-auto lg:overflow-y-auto lg:h-[70vh]">
                <div className="divide-y divide-gray-100 text-sm">
                  <div className="flex lg:block">
                    {currentRowData &&
                      Object.entries(currentRowData).map(([key, value]) => {
                        if (
                          key === "Previous Values" ||
                          key === "Updated Values" ||
                          key === "User Details" ||
                          key === "Updated Col. Name" ||
                          imageNames.includes(key)
                        ) {
                          return null;
                        } else {
                          return (
                            <div
                              className="flex flex-col lg:flex-row justify-center"
                              key={key}
                            >
                              <div className="py-2 px-2 text-center lg:w-1/2">
                                {key.toUpperCase()}
                              </div>
                              <div className="py-2 p-2 px-2 text-center lg:w-1/2">
                                <input
                                  className="text-center p-2 rounded-3xl lg:w-11/12"
                                  type="text"
                                  placeholder={value}
                                  value={value}
                                  onChange={(e) =>
                                    changeCurrentCsvDataHandler(
                                      key,
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                            </div>
                          );
                        }
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex  justify-around pb-3 lg:pb-5  px-4 lg:px-7 lg:w-full">
          <button
            onClick={() => setEditModal(false)}
            class="group inline-block rounded-3xl bg-blue-500 p-[2px] text-white hover:bg-indigo-600 focus:outline-none focus:ring active:text-opacity-75"
          >
            <span class="block rounded-sm  px-10 py-2 text-md font-medium group-hover:bg-transparent">
              Back
            </span>
          </button>
          <button
            onClick={() => {
              onUpdateCurrentDataHandler(currentRowData.id);
            }}
            class="group inline-block rounded-3xl bg-blue-500 p-[2px] text-white hover:bg-indigo-600 focus:outline-none focus:ring active:text-opacity-75"
          >
            <span class="block rounded-sm  px-10 py-2 text-md font-medium group-hover:bg-transparent">
              Save
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDuplicateData;
