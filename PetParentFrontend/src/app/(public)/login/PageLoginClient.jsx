"use client";
import "../../auth.css";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import ButtonGray from "@/components/button-gray/ButtonGray";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useLoginUserMutation } from "@/apis/authApi";
import { loginValidation } from "@/validations/form-validation";
import { useGoogleAuthMutation } from "@/apis/authApi";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/config/firebase";
import ButtonBlue from "@/components/button-blue/ButtonBlue";

const PageLoginClient = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [logindata, { isLoading }] = useLoginUserMutation();

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidation),
  });
  const [logingoogle, {}] = useGoogleAuthMutation();
  const onLogin = async (data) => {
    try {


      const save = await logindata(data).unwrap();

      const { status } = save;
      if (status) {
        toast.success("Login Successfully");
        reset();
      }
    } catch (err) {
      const { status, data } = err;
      if (status === 401 && !data.status) {
        toast.error("Invalid credentials");
      }
      if (status === 500 && !data?.status) {
        toast.error("Invalid credentials");
      }
    }
  };
  const googlesignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result.user;
      const { displayName, email } = user;
      const data = {
        name: displayName,
        email: email,
        profileUrl: user.photoURL,
      };
      const savedata = await logingoogle(data).unwrap();
      const { status } = savedata;
      if (status) {
        toast.success("Login Successfully");
        router.push("/");
      }
    } catch (err) {
      console.error("❌ Gmail login failed:", err);
    }
  };

  return (
    <>
      <section className="auth-wrapper bg-gradient section-padding">
        <Container className="rounded-5 bg-color-light p-3">
          <Row>
            <Col md={5}>
              <div className="auth-left">
                <Image
                  src="/images/gr93e.jpg"
                  alt=""
                  width="409"
                  height="416"
                  className="rounded-4"
                  style={{ width: "100%", height: "auto", objectFit: "cover" }}
                />
                <div className="auth-icons my-5 d-flex flex-wrap justify-content-evenly">
                  <div className="auth-icon d-inline-flex flex-column align-items-center gap-2 position-relative">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle">
                      <Image
                        src="/icons/icon-1.svg"
                        alt=""
                        width="24"
                        height="24"
                      />
                    </span>
                    <div className="fs-6">Create Account</div>
                  </div>
                  <div className="auth-icon d-inline-flex flex-column align-items-center gap-2 position-relative">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle">
                      <Image
                        src="/icons/icon-2.svg"
                        alt=""
                        width="24"
                        height="24"
                      />
                    </span>
                    <div className="fs-6">Add your pet</div>
                  </div>
                  <div className="auth-icon d-inline-flex flex-column align-items-center gap-2 position-relative">
                    <span className="d-inline-flex align-items-center justify-content-center rounded-circle">
                      <Image
                        src="/icons/icon-3.svg"
                        alt=""
                        width="24"
                        height="24"
                      />
                    </span>
                    <div className="fs-6">Start tracking</div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={7}>
              <div className="auth-right rounded-4 p-5 h-100 d-flex flex-column justify-content-center">
                <div className="auth-heading d-flex flex-wrap align-items-center justify-content-between mb-4">
                  <div className="fs-3 text-color-dark fw-semibold">
                    Login to Continue
                  </div>
                  <ButtonGray

                    handleclick={googlesignup}
                    buttonText="Login with Google"
                    buttonIcon="google"
                    iconPosition="right"
                  />
                </div>
                <Form onSubmit={handleSubmit(onLogin)}>
                  <Form.Group className="mb-3" controlId="formLoginEmail">
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      {...register("email")}
                    />
                    {errors?.email && (
                      <p className="text-danger">{errors?.email?.message}</p>
                    )}
                  </Form.Group>

                  <Form.Group
                    className="mb-3 position-relative"
                    controlId="formLoginPassword"
                  >
                    <div className="d-flex flex-wrap justify-content-between">
                      <Form.Label>Password</Form.Label>
                      <Link
                        href="/forgot-password"
                        className="text-color-dark link-main"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      name="password"
                      {...register("password")}
                    />
                    {errors?.password && (
                      <p className="text-danger">{errors?.password?.message}</p>
                    )}

                    <div
                      className="password-show-hide position-absolute"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer", right: "15px", top: "42px" }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formLoginTerms">
                    <Form.Check
                      type="checkbox"
                      label="I agree to the terms & policies."
                      name="agree"
                      {...register("agree")}
                    />
                    {errors?.agree && (
                      <p className="text-danger">{errors?.agree?.message}</p>
                    )}
                  </Form.Group>
                  <ButtonMain
                    disable={isLoading}
                    buttonText="Login"
                    buttonType="submit"
                    customClass="w-100 justify-content-center mt-4"
                  />
                </Form>
                <div className="text-center my-4">
                  Don't have an account?
                  <Link
                    href="/register"
                    className="text-color-dark ms-2 link-main"
                  >
                    Signup
                  </Link>
                </div>
                <div className="text-center mt-auto">
                  Secure signup • Private pet data • Takes under 2 minutes
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default PageLoginClient;
