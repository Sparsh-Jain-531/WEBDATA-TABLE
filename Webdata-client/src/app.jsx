import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Auth/Login";
import CreateUser from "./pages/Admin/CreateUser";
import { AllUser } from "./pages/Admin/AllUser";
import { PageNotFound } from "./pages/PageNotFound";
import { useContext, useEffect, useState } from "react";
import CsvHomepage from "./pages/CSV Comparer/CsvHomepage";
import Correction from "./pages/CSV Comparer/Correction";
import UserTaskAssined from "./pages/DataMatching/UserTaskAssined";
import ImageUploader from "./pages/ImageUploader/ImageUploader";
import ImageScanner from "./pages/ImageScanner/ImageScanner";
import dataContext from "./Store/DataContext";
import CsvUploader from "./pages/CsvUploader/CsvUploader";
import TemplateMapping from "./pages/TemplateMapping/TemplateMapping";
import HomePageTest from "./pages/HomePageTest";
import ResultGenerationProvider from "./Store/ResultGenerationProvider";
import TaskManager from "./pages/TaskManager/TaskManager";
import DataMatching from "./pages/DataMatching/DataMatching";
import { onGetVerifiedUserHandler } from "./services/common";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./pages/Auth/Profile";
import Assignee from "./pages/CSV Comparer/Assignee";
import DuplicityDetect from "./pages/DuplicityDetect/DuplicityDetect";
import UserDetail from "./pages/Admin/UserDetail";
import UpdatedDetails from "./pages/Admin/UpdatedDetails/UpdatedDetails";
import FieldDecision from "./pages/FieldDecision/FieldDecision";
import CsvTaskStatus from "./pages/CsvTaskStatus/CsvTaskStatus";
import Settings from "./pages/Settings/Settings";
import UserCorrectionData from "./pages/CSV Comparer/UserCorrectionData";
import PartA from "./pages/PartA/PartA";
import Merge from "./pages/Merge/Merge";
import MergeDuplicateDetect from "./pages/MergeDuplicateDetect/MergeDuplicateDetect";
import MergeDuplicateData from "./pages/MergeDuplicateDetect/MergeDuplicateData";
import MergeEditDuplicateData from "./pages/MergeDuplicateDetect/MergeEditDuplicateData";
import DataMapping from "./DataEntryMapping/DataMapping";

function App() {
  const datactx = useContext(dataContext);
  const [user, setUser] = useState({});
  const [serverIP, setServerIP] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await onGetVerifiedUserHandler();
        setUser(response);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchUserData();
  }, [datactx]);

  const role = user?.user?.role;
  const permissions = user?.user?.permissions;

  return (
    <Router>
      {datactx.isLogin && <Navbar />}
      <Routes>
        {datactx.isLogin && (
          <>
            {(role === "Admin" || role === "Moderator") && (
              <>
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create-user" element={<CreateUser />} />
                <Route path="/all-user" element={<AllUser />} />
                <Route path="/user-detail/:id" element={<UserDetail />} />
                <Route
                  path="/updated-details/:id"
                  element={<UpdatedDetails />}
                />
              </>
            )}

            {/* ------comparecsv----------- */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.comparecsv && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/comparecsv" element={<CsvHomepage />} />
                  <Route
                    path="/datamatching/csvtaskstatus"
                    element={<CsvTaskStatus />}
                  />
                  <Route
                    path="/comparecsv/assign_operator/:id"
                    element={<Assignee />}
                  />
                </>
              )}
            {/* ------------------dataEntry------------------ */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.dataEntry && (
                <>
                  <Route path="/profile" element={<Profile />} />

                  <Route
                    path="/datamatching"
                    element={
                      role !== "Admin" ? <UserTaskAssined /> : <DataMatching />
                    }
                  />
                  {/* <Route path="/datamatching/" element={<DataMatching />} /> */}
                  <Route path="/datamatching/:id" element={<DataMapping />} />
                  {/* <Route
                    path="datamatching/correct_compare_csv"
                    element={<Correction />}
                  /> */}
                  <Route
                    path="datamatching/correct_compare_csv"
                    element={<UserCorrectionData />}
                  />
                </>
              )}
            {/* ------------------PartA------------------ */}
            {/* {(role === "Admin" ||
              role === "Moderator") && (
                <>
                  <Route path="/partA" element={<PartA />} />
                </>
              )} */}

            {/* ------------------Merge------------------ */}
            {(role === "Admin" || role === "Moderator") && (
              <>
                <Route path="/merge" element={<Merge />} />
                <Route
                  path="/merge/duplicate"
                  element={<MergeDuplicateDetect />}
                />
                <Route
                  path="/merge/duplicate/data"
                  element={<MergeDuplicateData />}
                />
                <Route
                  path="/merge/duplicate/data/edit"
                  element={<MergeEditDuplicateData />}
                />
              </>
            )}

            {/* -----------------csvuploader------------------- */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.csvuploader && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/csvuploader" element={<CsvUploader />} />
                  <Route
                    path="/csvuploader/duplicatedetector/:id"
                    element={<DuplicityDetect />}
                  />
                  <Route
                    path="/csvuploader/templatemap/:id"
                    element={<TemplateMapping />}
                  />
                  <Route
                    path="/csvuploader/fieldDecision/:id"
                    element={<FieldDecision />}
                  />
                  <Route
                    path="/csvuploader/taskAssign/:id"
                    element={<TaskManager />}
                  />
                </>
              )}
            {/* ---------createTemplate------------ */}
            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.createTemplate && (
                <>
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/imageuploader" element={<ImageUploader />} />
                  <Route
                    path="/imageuploader/scanner"
                    element={<ImageScanner />}
                  />
                </>
              )}

            {(role === "Admin" ||
              role === "Moderator" ||
              role === "Operator") &&
              permissions.resultGenerator && (
                <>
                  <Route
                    path="/resultGeneration"
                    element={
                      <ResultGenerationProvider>
                        <HomePageTest />
                      </ResultGenerationProvider>
                    }
                  />
                  <Route path="/profile" element={<Profile />} />
                </>
              )}

            <Route
              path="*"
              element={
                <PageNotFound errorMessage="Page Not Found" errorCode="404" />
              }
            />
          </>
        )}

        {!datactx.isLogin && (
          <>
            <Route path="/" element={<Login />} />
            <Route
              path="*"
              element={
                <PageNotFound
                  errorMessage="User Not Authorised"
                  errorCode="401"
                />
              }
            />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
