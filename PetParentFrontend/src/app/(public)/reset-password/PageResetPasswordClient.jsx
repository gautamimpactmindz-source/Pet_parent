"use client";
import "../../auth.css";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { useForm } from "react-hook-form";
import { resetpasswordValidation } from "@/validations/form-validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { resetToken } from "@/store/slices/authSlice";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useResetPasswordMutation } from "@/apis/authApi";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ButtonBlue from "@/components/button-blue/ButtonBlue";

const PageResetPasswordClient = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const dispatch = useDispatch();
  const [changepass, { isLoading }] = useResetPasswordMutation();
  const rstoken = useSelector((state) => state.auth.token);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetpasswordValidation),
  });

  const handlePassword = async (data) => {
    try {
      if (!rstoken) {
        console.log("Token not found");
        return;
      }

      const resetpass = await changepass({
        credentials: data,
        rstoken: rstoken,
      }).unwrap();
      const { status, message } = resetpass;
      if (status) {
        toast.success(message, {
          style: {
            width: "400px"
          }
        })
        router.push('/login')
      }

    } catch (err) {

      const { status, data } = err;
      const { message } = data;
      if (status === 401) {
        toast.warn(message);
      }
      else if (status === 400) {
        toast.error("Fields are required")
      }
      else if (status === 500) {
        toast.error("Server Error !")
      }
    }
  };
  useEffect(() => {
    if (token != null) {
      dispatch(resetToken(token));
    }
  }, [token]);
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
                    Reset Password
                  </div>
                </div>
                <Form onSubmit={handleSubmit(handlePassword)}>
                  <Form.Group
                    className="mb-3 position-relative"
                    controlId="formResetPasswordPassword"
                  >
                    <div className="d-flex flex-wrap justify-content-between">
                      <Form.Label>New Password</Form.Label>
                      {/*  */}
                    </div>
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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
                  <Form.Group
                    className="mb-3 position-relative"
                    controlId="formResetPasswordRepeatPassword"
                  >
                    <div className="d-flex flex-wrap justify-content-between">
                      <Form.Label>Re-enter Password</Form.Label>
                      {/*  */}
                    </div>
                    <Form.Control
                      type={showRepeatPassword ? "text" : "password"}
                      placeholder="Re enter new password"
                      name="confirmPassword"
                      {...register("confirmPassword")}
                    />
                    {errors?.confirmPassword && (
                      <p className="text-danger">
                        {errors?.confirmPassword?.message}
                      </p>
                    )}
                    <div
                      className="password-show-hide position-absolute"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      style={{ cursor: "pointer", right: "15px", top: "42px" }}
                    >
                      <FontAwesomeIcon
                        icon={showRepeatPassword ? faEyeSlash : faEye}
                      />
                    </div>
                  </Form.Group>
                  <ButtonMain
                    disable={isLoading}
                    buttonText="Reset Password"
                    buttonType="submit"
                    customClass="w-100 justify-content-center my-4"
                  />
                </Form>
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

export default PageResetPasswordClient;
