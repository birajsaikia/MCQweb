import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './Component/Signup';
import Header from './Component/Hearder';
import Event from './Component/Event';
import Login from './Component/Login';
import Home from './Component/Home';
import Footer from './Component/Footer';
import Milestone from './Component/Milestone';
import AdminLogin from './Component/AdminLogin';
import Admin from './Component/Admin';
import Userprofile from './Component/Userprofile';
import Addquation from './Component/AddQuation';
import Course from './Component/Course';
import Viewquationuser from './Component/ViewQuationUser';
import Addsubject from './Component/AddSubject';
import AddCoSubject from './Component/Addcosubject';
import ViewSubjectPage from './Component/ViewSubject';
import ViewCoSubject from './Component/ViewCosubject';
// import Forgetpassword from './Component/forgetpassword';
import Resetpassword from './Component/reset-password';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event" element={<Event />} />
          <Route path="/signup/:referralCode?" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/milestone" element={<Milestone />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/userprofile" element={<Userprofile />} />
          <Route path="/addquation" element={<Addquation />} />
          <Route path="/course" element={<Course />} />
          {/* <Route path="/forgetpassword" element={<Forgetpassword />} /> */}
          <Route path="/resetpassword" element={<Resetpassword />} />

          <Route
            path="/:course/addsubject/:courseId"
            element={<Addsubject />}
          />
          <Route
            path="/:course/:subject/cosubject/:courseId/:subjectId"
            element={<AddCoSubject />}
          />
          <Route
            path="/coursequation/:courseId/:subjectId/:cosubjectId"
            element={<Viewquationuser />}
          />
          <Route path="/viewsubject/:courseId" element={<ViewSubjectPage />} />
          <Route
            path="/viewcosubject/:courseId/:subjectId"
            element={<ViewCoSubject />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
