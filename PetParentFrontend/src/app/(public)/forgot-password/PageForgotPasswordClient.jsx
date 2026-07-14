"use client";
import "../../auth.css";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailvalidation } from "@/validations/form-validation";
import { useForgetPasswordMutation } from "@/apis/authApi";
import { toast } from "react-toastify";
import ButtonBlue from "@/components/button-blue/ButtonBlue";
const PageForgotPasswordClient = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(emailvalidation)
  })
  const [forgetpass, { isLoading }] = useForgetPasswordMutation();
  const forgetPassword = async (data) => {
    try {
      const response = await forgetpass(data).unwrap();
      const { status, message } = response;
      if (status) {
        toast.success(message, {
          style: { width: "400px" }
        });
        reset();
      }
    } catch (err) {
      console.log(err);
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
                    Forgot Password?
                  </div>
                </div>
                <Form onSubmit={handleSubmit(forgetPassword)}>
                  <Form.Group
                    className="mb-3"
                    controlId="formForgotPasswordEmail"
                  >
                    <Form.Label>E-mail</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email address"
                      name="email"
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="text-danger">
                        {errors?.email?.message}
                      </p>
                    )}
                  </Form.Group>
                  <ButtonMain
                    disable={isLoading}
                    buttonText="Send reset link"
                    buttonType="submit"
                    customClass="w-100 justify-content-center my-4"
                  />
                  {/* <div className="send_link text-end"><p className="expiretext mt-1"><a href="">Link expired? Request a new reset link</a></p>
                  </div> */}
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

export default PageForgotPasswordClient;
