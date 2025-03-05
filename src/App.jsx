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
import About from './Component/about';
import Resetpassword from './Component/reset-password';
import Adminquationview from './Component/Quationviewadmin';
import Subjectlanding from './Component/Subjectlanding';
import AddPYQ from './Component/AddPYQ';
import ViewpyqQuation from './Component/viewPyqquations';
import AddMockTest from './Component/AddMocktest';
import ViewMockTest from './Component/AddMocktest';
import MockTest from './Component/Mocktest';
import PyqQuation from './Component/PYQquationView';

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
          <Route path="/about" element={<About />} />
          <Route
            path="/subjectlanding/:courseId"
            element={<Subjectlanding />}
          />
          <Route path="/:course/addpyq/:courseId" element={<AddPYQ />} />
          <Route
            path="/:course/addmocktest/:courseId"
            element={<AddMockTest />}
          />
          <Route
            path="/viewpyqquation/:courseId/:paperId"
            element={<ViewpyqQuation />}
          />
          <Route
            path="/viewmocktestquation/:courseId/:paperId"
            element={<ViewMockTest />}
          />

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
          <Route
            path="/pyqquation/:name/:year/:courseId/:paperId"
            element={<PyqQuation />}
          />
          <Route
            path="/quations/:courseId/:subjectId/:cosubjectId"
            element={<Adminquationview />}
          />

          <Route path="/viewsubject/:courseId" element={<ViewSubjectPage />} />
          <Route path="/mocktest/:courseId" element={<MockTest />} />
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
