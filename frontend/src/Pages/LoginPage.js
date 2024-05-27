import axios from "axios";
import React from "react";
import { doLogin } from "../Auth/Auth";
import { useNavigate } from "react-router-dom";
// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

const LoginPage = () => {

  const navigate = useNavigate();


  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   const email = e.target.email.value;
  //   const password = e.target.password.value;
  //   const role = e.target.role.value;

  //   axios.post(`${process.env.REACT_APP_HOST_URL}/users/loginUser`, {
  //       email,
  //       password,
  //       role,
  //     })
  //     .then((res) => {
  //       // console.log(res.data.role);
  //       doLogin(res.data.accessToken);

  //       if(res.data.role === "Admin"){
  //         navigate("/admin/dashboard");
  //       }else{
  //         navigate("/user/dashboard");
  //       }
        
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  
  const validation = useFormik({

    initialValues:{
        email:"",
        password:"",
        role:""
    },
    validationSchema:Yup.object({
      email: Yup.string().required("Required?"),
      password: Yup.string().required("Required?").min(6, 'Too Short!'),
      role: Yup.string().required("Required?")
    }),
    onSubmit:(value)=>{

      // console.log(value)

    const email = value.email;
    const password = value.password;
    const role = value.role;

    axios.post(`${process.env.REACT_APP_HOST_URL}/users/loginUser`, {
        email,
        password,
        role,
      })
      .then((res) => {
        // console.log(res.data.role);
        doLogin(res.data.accessToken);

        if(res.data.role === "Admin"){
          navigate("/admin/dashboard");
        }else{
          navigate("/user/dashboard");
        }
        
      })
      .catch((err) => {
        console.log(err);
      });

     }

  })



  return (
    <>
      <div className="login-main-wrapper">
       <div className="bg-layer">
       <div className="login-inner-wrapper shadow">
          <div className="login-logo">
            <h3>
              <img className="logo" src="../Images/logo1.png" alt="" />
              TaskTracker
            </h3>
            <p>&copy; {new Date().getFullYear()} Created by Laukik Palekar</p>
          </div>
          <div className="login-details">
            <form onSubmit={(e)=>{
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}>
              <div className="form-wrapper">
              <div className="d-flex flex-column align-items-end">
              {validation.touched.email && validation.errors.email ? (
                      <div className="error-message">{validation.errors.email}</div>
                        ) : null}
                <div className="form-inner-wrapper">
                  <label style={{paddingRight: "28px"}}>
                    Email
                  </label> 
                  <input type="email" name="email"  placeholder="" value={validation.values.email || ""} onChange={validation.handleChange} onBlur={validation.handleBlur} />
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end">
                  {validation.touched.password && validation.errors.password ? (
                      <div className="error-message">{validation.errors.password}</div>
                        ) : null}
                <div className="form-inner-wrapper">
                  <label>
                    Password
                  </label>
                  
                  <input type="password" name="password" placeholder="" value={validation.values.password || ""} onChange={validation.handleChange} onBlur={validation.handleBlur}/>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-center">
                <div className="radio-main-wrapper">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="role"
                      id="flexRadioDefault1"
                      value="Admin"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Admin
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="role"
                      id="flexRadioDefault1"
                      value="Project Manager"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Project Manager
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      name="role"
                      id="flexRadioDefault1"
                      value="Team Member"
                      onChange={validation.handleChange}
                      onBlur={validation.handleBlur}
                    />
                    <label class="form-check-label" for="flexRadioDefault1">
                      Team Member
                    </label>
                  </div>
                  </div>
                  {validation.touched.role && validation.errors.role ? (
                      <div className="error-message">{validation.errors.role}</div>
                        ) : null}
               

                </div>
                <button type="submit" className="login-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
       </div>
      </div>
    </>
  );
};

export default LoginPage;
