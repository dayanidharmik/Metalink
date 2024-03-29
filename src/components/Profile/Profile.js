import React, { useState, useEffect, useRef } from "react";
import ManinHeader from "../Layout/ManinHeader";
import Footer from "../Layout/Footer";
import $ from "jquery";
import "../../css/profile.css";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { logout, selecUser, updateProfile } from "../feature/user";
import instance from "../baseUrl/baseUrl";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpVerificationFormobile from "../OtpVerification/OtpVerificationFormobile";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../../Firebase-config";
import useEncryption from "../EncryptData/EncryptData";

const Profile = ({ socket }) => {
  document.title = "Profile";
  const [UserName, setUserName] = useState("");
  const [inviteCode, setinviteCode] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setcountryCode] = useState("");
  const [password, setPassword] = useState("");
  const [cpwd, setCpwd] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mobile, setmobile] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [oldMobile, setOldMobile] = useState("");
  const [ProfileData, SetProfileData] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showimg, setshowImg] = useState(false);
  const [IsValid, setIsValid] = useState(false);
  const [phone, setphone] = useState("");
  const [selCountryExpectedLength, setSelCountryExpectedLength] = useState(0);
  const getItem = JSON.parse(localStorage.getItem("user"));
  const effectCalled = useRef(false);
  const { encryptData, decryptData } = useEncryption();
  const user = useSelector(selecUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function closeOtpBox() {
    setShowOtpBox(false);
  }

  /*============= Toast Fire Notifaction==========*/

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  /*================editing btn========== */

  var selector = ".editing-btn";
  $(selector).on("click", function () {
    $(selector).removeClass("active");
    $(this).addClass("active");
  });

  /*========outside click event username =========== */
  function useOutsideclickusername(username) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (username.current && !username.current.contains(event.target)) {
          var selector = ".username";
          $(selector).removeClass("active");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [username]);
  }
  const username = useRef(null);
  useOutsideclickusername(username);

  /*========outside click event email =========== */
  function useOutsidclickemail(emailclick) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (emailclick.current && !emailclick.current.contains(event.target)) {
          var selector = ".emailclick";
          $(selector).removeClass("active");
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [emailclick]);
  }
  const emailclick = useRef(null);
  useOutsidclickemail(emailclick);

  /*========outside click event password =========== */
  function useOutsidclickpassord(passwordclick) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (
          passwordclick.current &&
          !passwordclick.current.contains(event.target)
        ) {
          var selector = ".passwordclick";
          $(selector).removeClass("active");
          setshowImg(false);
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [passwordclick]);
  }
  const passwordclick = useRef(null);
  useOutsidclickpassord(passwordclick);

  /*========outside click event Phone Number =========== */
  function useOutsidclickPhoneNumber(PhoneNumber) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (
          PhoneNumber.current &&
          !PhoneNumber.current.contains(event.target)
        ) {
          var selector = ".PhoneNumber";
          $(selector).removeClass("active");
          // setshowImg(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [PhoneNumber]);
  }
  const PhoneNumber = useRef(null);
  useOutsidclickPhoneNumber(PhoneNumber);

  // /*=============== useEffect for getUserProfile calling======= */
  useEffect(() => {
    if (!effectCalled.current) {
      getUserProfile();

      // socket.disconnect();
      effectCalled.current = true;
    }
    //eslint-disable-next-line
  }, [user]);

  /*=============LOGOUT FUNCTION===========*/
  const handleogout = (e) => {
    e.preventDefault();
    socket.disconnect(getItem?._id);
    dispatch(logout());
    localStorage.removeItem("user");
    navigate("/");
  };
  // console.log(ProfileData._id)

  /*=================getUserProfile API============= */

  const getUserProfile = async () => {
    try {
      const result = await instance.get("/getUserProfile");

      const results = decryptData(result.data.data);
      //console.log("getUserProfile", results);

      if (results.success) {
        // Toast.fire({
        //   icon: "success",
        //   title: results.message,
        // });
        SetProfileData(results.data);
        setUserName(results.data.username);
        setEmail(results.data.email);
        setcountryCode(results.data.countryCode);
        setPhoneNumber(results.data.phoneNumber);
        setinviteCode(results.data.inviteCode);
        setmobile(results.data.countryCode + results.data.phoneNumber);
        if (!IsValid) {
          phone.length !== selCountryExpectedLength
            ? setIsValid(false)
            : setIsValid(true);
        }
        setOldMobile(results.data.countryCode + results.data.phoneNumber);
        localStorage.setItem(
          "user",
          JSON.stringify({
            _id: results.data._id,
            active: results.data.active,
            username: results.data.username,
            email: results.data.email,
            countryCode: results.data.countryCode,
            phoneNumber: results.data.phoneNumber,
            refCode: results.data.inviteCode,
          })
        );
        dispatch(
          updateProfile({
            _id: results.data._id,
            active: results.data.active,
            username: results.data.username,
            email: results.data.email,
            countryCode: results.data.countryCode,
            phoneNumber: results.data.phoneNumber,
            refCode: results.data.inviteCode,
          })
        );
      } else {
        Toast.fire({
          icon: "error",
          title: results.message,
        });
      }
    } catch (err) {
      //console.log("err" + err);
    }
  };

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "sign-in-button",
      {
        // size: "invisible",
        callback: (response) => {
          //console.log(response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // savadata();
        },
      },
      auth
    );
  };
  /*================ERROR MESSAGE============= */

  let errorsObj = {
    username: "",
    email: "",
    phoneNumber: "",
    password: "",
    cpwd: "",
    refCode: "",
  };
  const [errors, setErrors] = useState(errorsObj);

  const onSignInSubmit = (e) => {
    setshowImg(false);
    e.preventDefault();

    let error = false;

    errorsObj = { ...errorsObj };

    if (UserName === "") {
      errorsObj.username = "*Username is required!";
      error = true;
    }

    if (phoneNumber === "") {
      errorsObj.phoneNumber = "*PhoneNumber is required!";
      error = true;
    } else if (!IsValid) {
      errorsObj.phoneNumber = "*PhoneNumber is wrong!";
      error = true;
    }

    if (email === "") {
      errorsObj.email = "*Email address is required!";
      error = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errorsObj.email = "*Email address is invalid!";
      error = true;
    }

    if (password && password.length < 8) {
      errorsObj.password = "Password must be 8 or more characters";
      error = true;
      setshowImg(true);
    }

    if (password !== cpwd) {
      errorsObj.cpwd = "*Confirm password is not matched!";
      error = true;
      setshowImg(true);
    }
    // setshowImg(true);
    setErrors(errorsObj);
    if (error) return;
    savadata();
  };
  /*=================updateProfile API============= */
  const savadata = async () => {
    if (oldMobile === mobile) {
      try {
        setShowOtpBox(false);
        const encrypt = encryptData(
          JSON.stringify({
            username: ProfileData.username !== UserName ? UserName : null,
            email: ProfileData.email !== email ? email : null,
            password: password,
            countryCode:
              ProfileData.countryCode !== countryCode ? countryCode : null,
            phoneNumber:
              ProfileData.phoneNumber !== phoneNumber ? phoneNumber : null,
          })
        );
        const result = await instance.put("/updateProfile", {
          data: encrypt,
        });

        const results = decryptData(result.data.data);
        console.log(results);
        if (results.success) {
          Toast.fire({
            icon: "success",
            title: results.message,
          });
          SetProfileData(results.data);
          var selector = ".editing-btn";
          $(selector).removeClass("active");
          localStorage.setItem(
            "user",
            JSON.stringify({
              _id: results.data._id,
              active: results.data.active,
              username: results.data.username,
              email: results.data.email,
              countryCode: results.data.countryCode,
              phoneNumber: results.data.phoneNumber,
              refCode: results.data.inviteCode,
            })
          );
          setCpwd("");
          setinviteCode(results.data.inviteCode);
          setUserName(results.data.username);
          setEmail(results.data.email);
          setPhoneNumber(results.data.phoneNumber);
          setcountryCode(results.data.countryCode);
          setmobile(results.data.countryCode + results.data.phoneNumber);
          setOldMobile(results.data.countryCode + results.data.phoneNumber);

          dispatch(
            updateProfile({
              _id: results.data._id,
              active: results.data.active,
              username: results.data.username,
              email: results.data.email,
              countryCode: results.data.countryCode,
              phoneNumber: results.data.phoneNumber,
              refCode: results.data.inviteCode,
            })
          );
        } else {
          Toast.fire({
            icon: "error",
            title: results.message,
          });
        }
      } catch (err) {
        //console.log("err" + err);
      }
    } else {
      setUpRecaptcha();
      const mobile = oldMobile;
      const appVerifier = window.recaptchaVerifier;
      //console.log("otp sent on this number", mobile);
      signInWithPhoneNumber(auth, mobile, appVerifier)
        .then((confirmationResult) => {
          // SMS sent. Prompt user to type the code from the message, then sign the
          // user in with confirmationResult.confirm(code).
          window.confirmationResult = confirmationResult;
          setShowOtpBox(true);
          //console.log("otp sent");
          Toast.fire({
            icon: "success",
            title: "otp sent",
          });
        })
        .catch((error) => {
          // Error; SMS not sent
          // ...
          //console.log(error);
          Toast.fire({
            icon: "error",
            title: "SMS not sent Plase try again.",
          });
        });
    }
  };

  /*=======SHOW PASSWORD====== */
  const onShowPassword = () => {
    setShowPass(!showPass);
  };

  //* Prevent User For Entering Spaces
  const preventSpace = (e) => {
    if (e.which === 32) {
      e.preventDefault();
    }
  };

  return (
    <div>
      {showOtpBox ? (
        <OtpVerificationFormobile
          countryCode={countryCode}
          phone={phoneNumber}
          oldMobile={oldMobile}
          username={UserName}
          email={email}
          password={password}
          closeOtpBox={closeOtpBox}
          setmobile={setmobile}
          setOldMobile={setOldMobile}
          ProfileData={ProfileData}
          mobile={mobile}
        />
      ) : (
        <div className="mining-bg ">
          {/* <!-- ------------------- MINING START ----------------- --> */}

          <ManinHeader />
          {/* <!-- ------------------- Profile ----------------- -->     */}
          <div>
            <section className="profile w-100 d-md-inline-block position-relative">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-10 col-12">
                    <h3 className="common-heading text-center mb-0">Profile</h3>
                    <form className="currentuser-profile" autoComplete="off">
                      <div className="row profile-wrap align-items-baseline">
                        <div className="col-md-6 profile-padding">
                          <div className="profile-box">
                            <h4 className="team-title">
                              {ProfileData.username}
                            </h4>

                            <label className="label-title1 position-absolute">
                              Username
                            </label>
                            <div
                              className="profile-name position-relative userNames"
                              onClick={() => selector}
                            >
                              <span className="name-info1 w-100 d-inline-block">
                                {ProfileData.username}
                              </span>

                              <div
                                className="editing-btn username"
                                ref={username}
                              >
                                <img
                                  src="../../img/profile/editing.png"
                                  alt="editing-img"
                                  onClick={() => setshowImg(false)}
                                  //
                                />
                                <input
                                  type="text"
                                  name="John Wick"
                                  placeholder="User Name"
                                  // className="profile-input"
                                  className={`${
                                    errors.username
                                      ? "profile-input-errorMsg"
                                      : "profile-input"
                                  }`}
                                  value={UserName ? UserName : ""}
                                  onChange={(e) => setUserName(e.target.value)}
                                />
                              </div>
                            </div>
                            {errors.username && (
                              <div className="errorMsg-profile">
                                {errors.username}
                              </div>
                            )}
                            <div className="form-group">
                              <label className="label-title">
                                Invitation code to share
                              </label>
                              <div
                                id="inviteCode"
                                className="invite-page position-absolute"
                              >
                                <input
                                  name="name"
                                  value={inviteCode ? inviteCode : ""}
                                  onChange={(e) =>
                                    setinviteCode(e.target.value)
                                  }
                                  readOnly
                                />
                              </div>
                              <div id="copyClipboard">
                                <img
                                  src="../../img/profile/copy-icon.png"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      getItem.refCode
                                    );
                                    Toast.fire({
                                      icon: "success",
                                      title: "copied successfully",
                                    });
                                  }}
                                  className="copy-invite-code"
                                  alt="copyIcon"
                                />
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="label-title">
                                Referral link to share
                              </label>
                              <div className="referral-link position-absolute">
                                {`https://metalinknetwork.com/${inviteCode}`}
                              </div>
                              <button
                                onClick={() => setIsOpen(true)}
                                className="share-button border-0 bg-transparent"
                                type="button"
                                title="Share this article"
                              >
                                <img
                                  src="../../img/profile/share-link.png"
                                  alt="editing-img"
                                />
                              </button>
                            </div>
                            <div className="p-1">
                              <h6 className="account-title  mb-4">
                                Account Verification
                              </h6>
                              <div className="form-group">
                                <label className="name-title">
                                  Account deletion
                                </label>
                                <div className="members-info d-flex justify-content-between align-items-center">
                                  Tap here to delete your account.
                                  <div className="request-info">
                                    <a href="/#" className="request-btn">
                                      Request
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="col-md-6 profile-padding"
                          onClick={() => selector}
                        >
                          <div className="profile-tabs d-flex align-items-start justify-content-between">
                            <h6 className="account-title mt-0">Profile</h6>

                            <a
                              href="#save"
                              className="save-btn text-decoration-none"
                              onClick={(e) => onSignInSubmit(e)}
                            >
                              Save
                            </a>
                          </div>
                          <div className="form-group multi-field-wrapper position-relative">
                            <label className="label-title1 position-absolute">
                              Email id
                            </label>
                            <div className="profile-name position-relative">
                              <span className="name-info w-100 d-inline-block">
                                {ProfileData.email}
                              </span>
                              <div
                                className="editing-btn emailclick"
                                ref={emailclick}
                              >
                                <img
                                  src="../../img/profile/editing.png"
                                  alt="editing-img"
                                  onClick={() => setshowImg(false)}
                                />
                                <input
                                  type="email"
                                  name="John Wick"
                                  placeholder="Email id"
                                  // className="profile-input"
                                  className={`${
                                    errors.email
                                      ? "profile-input-errorMsg"
                                      : "profile-input"
                                  }`}
                                  value={email ? email : ""}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            </div>
                            {errors.email && (
                              <div className="errorMsg-profile-email">
                                {errors.email}
                              </div>
                            )}
                          </div>
                          <div ref={passwordclick} className=" passwordclick">
                            <div className="form-group multi-field-wrapper position-relative">
                              <label className="label-title1 position-absolute">
                                Password
                              </label>
                              <div className="profile-name position-relative">
                                <span className="name-info w-100 d-inline-block">
                                  ********
                                </span>
                                <div
                                  className="editing-btn passwordclick"
                                  onClick={() => setshowImg(true)}
                                >
                                  <img
                                    src="../../img/profile/editing.png"
                                    alt="editing-img"
                                  />
                                  <input
                                    type={`${showPass ? "text" : "password"}`}
                                    name="pwd"
                                    placeholder="Password"
                                    minLength="8"
                                    onKeyPress={preventSpace}
                                    className={`${
                                      errors.password
                                        ? "profile-input-errorMsg"
                                        : "profile-input"
                                    }`}
                                    value={password}
                                    onChange={(e) =>
                                      setPassword(e.target.value)
                                    }
                                  />
                                </div>
                              </div>
                              {showimg ? (
                                <img
                                  role="button"
                                  alt="show-eye-img"
                                  onClick={onShowPassword}
                                  src={`${
                                    showPass
                                      ? "../../img/profile/openeye.png"
                                      : "../../img/profile/hiddenEye.png"
                                  }`}
                                  className="show-eye"
                                />
                              ) : (
                                <div className="d-none"></div>
                              )}

                              {errors.password && (
                                <div className="errorMsg-profile-email">
                                  {errors.password}
                                </div>
                              )}
                            </div>
                            {/* ref={Confirmpasswordclick} */}
                            {showimg ? (
                              <div className="position-relative">
                                <label className="label-title1 position-absolute">
                                  Confirm Password
                                </label>
                                <input
                                  type="text"
                                  name="cpwd"
                                  placeholder="Confirm Password"
                                  minLength="8"
                                  onKeyPress={preventSpace}
                                  className={`${
                                    errors.password
                                      ? "profile-input-errorMsg mb-4"
                                      : "profile-input mb-4"
                                  }`}
                                  value={cpwd}
                                  onChange={(e) => setCpwd(e.target.value)}
                                />
                                {errors.cpwd && (
                                  <div className="errorMsg-profile   ">
                                    {errors.cpwd}
                                  </div>
                                )}
                              </div>
                            ) : null}
                          </div>

                          <div className="form-group multi-field-wrapper position-relative">
                            <label className="label-title1 position-absolute">
                              Phone Number
                            </label>
                            <div className="profile-name position-relative">
                              <span className="name-info w-100 d-inline-block">
                                {countryCode} {phoneNumber}
                                {/* {mobile} */}
                              </span>
                              <div
                                className="editing-btn PhoneNumber"
                                ref={PhoneNumber}
                              >
                                <img
                                  src="../../img/profile/editing.png"
                                  alt="editing-img"
                                  onClick={() => setshowImg(false)}
                                />

                                <div className="phone">
                                  <PhoneInput
                                    className="profile-input"
                                    name="phoneNumber "
                                    type="phone"
                                    placeholder=" Phone Number "
                                    countryCodeEditable={false}
                                    specialLabel={""}
                                    searchPlaceholder="Search"
                                    country={"in"}
                                    value={mobile}
                                    enableSearch
                                    onChange={(
                                      inputPhone,
                                      countryData,
                                      value,
                                      data,
                                      dialcode,
                                      inputNumber,
                                      e
                                    ) => {
                                      setcountryCode(
                                        `+${countryData.dialCode}`
                                      );
                                      setPhoneNumber(
                                        inputPhone.slice(countryCode.length - 1)
                                      );
                                      setmobile("+" + inputPhone);

                                      setphone(data);
                                      setSelCountryExpectedLength(
                                        countryData.format.length
                                      );
                                    }}
                                    inputStyle={{
                                      background: "#E2F1FE",
                                      padding: "25px 1px 20px 50px",
                                      marginTop: "22px",
                                      border: errors.phoneNumber
                                        ? "red 1px solid"
                                        : "none",
                                    }}
                                    inputProps={{
                                      required: true,
                                      autoFocus: true,
                                    }}
                                    onBlur={() => {
                                      phone.length !== selCountryExpectedLength
                                        ? setIsValid(false)
                                        : setIsValid(true);
                                    }}
                                    isValid={() =>
                                      !IsValid
                                        ? phone.length ===
                                          selCountryExpectedLength
                                        : IsValid
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                            {errors.phoneNumber && (
                              <div className="errorMsg-profile-email">
                                {errors.phoneNumber}
                              </div>
                            )}
                          </div>
                          <div id="sign-in-button" />
                        </div>
                      </div>
                    </form>
                    <button
                      className="signout-btn"
                      onClick={(e) => handleogout(e)}
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
              {/* <!-- Referral_link_to_share_Popup --> */}
              {isOpen ? (
                <div id="Invite-Modal">
                  <section className="Invite">
                    <div className="container">
                      <div className="row justify-content-center">
                        <div className="col-lg-5">
                          <div className="Invite-modal" >
                            <a
                              href="#close"
                              className="justify-content-end d-flex close-btn"
                            >
                              <img
                                src="../../img/profile/close.png"
                                alt="close-img"
                                onClick={() => setIsOpen(false)}
                              />
                            </a>
                            <h2 className="Invite-content  align-items-center">
                              Invite
                            </h2>
                            <div className="Invite-social  d-sm-flex d-none">
                              <div className="social-bg">
                                <a
                                  href={`https://discord.com/channels/@me?url=Join my team on metalink https://metalinknetwork.com/signup/?ref=${getItem.refCode}`}
                                  className="social-icon"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src="../../img/icon/discord.svg"
                                    alt=""
                                    className="simple-social-icon"
                                  />
                                  <img
                                    src="../../img/icon/discord-hover.png"
                                    alt=""
                                    className="fill-social-icon"
                                  />
                                </a>
                              </div>
                              <div className="social-bg">
                                <a
                                  href={`https://twitter.com/compose/tweet?url=Join my team on metalink https://metalinknetwork.com/signup/?ref=${getItem.refCode}`}
                                  className="social-icon"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src="../../img/icon/twitter.svg"
                                    alt=""
                                    className="simple-social-icon"
                                  />
                                  <img
                                    src="../../img/icon/twitter-hover.png"
                                    alt=""
                                    className="fill-social-icon"
                                  />
                                </a>
                              </div>
                              <div className="social-bg">
                                <a
                                  // href={`https://www.linkedin.com/sharing/share-offsite/?url=https://metalinknetwork.com/signup/?ref=${getItem.refCode}`}
                                  href={`https://www.linkedin.com/sharing/share-offsite/?url=https://metalinknetwork.com/signup/?ref=${getItem.refCode}`}
                                  className="social-icon"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src="../../img/icon/linkedinhover.png"
                                    alt=""
                                    className="simple-social-icon"
                                  />
                                  <img
                                    src="../../img/icon/linkedin.png"
                                    alt=""
                                    className="fill-social-icon"
                                  />
                                </a>
                              </div>
                              <div className="social-bg">
                                <a
                                  href="https://www.instagram.com/metalinknetwork/"
                                  className="social-icon"
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <img
                                    src="../../img/icon/instagram.svg"
                                    alt=""
                                    className="simple-social-icon"
                                  />
                                  <img
                                    src="../../img/icon/instagram-hover.png"
                                    alt=""
                                    className="fill-social-icon"
                                  />
                                </a>
                              </div>
                            </div>
                            <div className="d-flex input-Invite-shre mb-0">
                              <div>{`https://metalinknetwork.com/${getItem.refCode}`}</div>
                              <img
                                src="../../img/profile/copy-icon.png"
                                alt=""
                                className="copy-invite-share"
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `https://metalinknetwork.com/signup/?ref=${getItem.refCode}`
                                  );
                                  Toast.fire({
                                    icon: "success",
                                    title: "copied successfully",
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              ) : null}
            </section>
          </div>

          {/* <!--------------- Footer Start --------------> */}
          <Footer />

          {/* <!-- ------------------- CURRENT MINING RATE END ----------------- --> */}
        </div>
      )}
    </div>
  );
};

export default Profile;
