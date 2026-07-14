"use client";

import React, { useState } from "react";
import '../../../../auth.css'
import { useLoginAdminMutation } from "@/apis/adminAuthApi";
import { adminLoginValidation } from "@/validations/form-validation";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Form from "react-bootstrap/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import { Col, Container, Row } from "react-bootstrap";

import ButtonMain from "@/components/button-main/ButtonMain";

const AdminLogin = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(adminLoginValidation),
  });

  const onLogin = async (data) => {
    try {
      const res = await loginAdmin(data).unwrap();

      if (res.status) {
        toast.success("Admin Login Successful");

        router.push("/admin/dashboard");
      }
    } catch (error) {
      toast.error("Invalid admin credentials");
    }
  };

  return (
    <section className=" d-flex align-items-center " style={{ minHeight: "100vh" }}>
      <Container className=" p-3">
        <Row className="justify-content-center" >

          <Col md={8} lg={5}>
            <div className="auth-right  bg-color-light p-5 d-flex flex-column justify-content-center">
              <div className="auth-heading text-center mb-4">
                <div className="fs-3 text-color-dark fw-semibold">
                  Admin Portal Login
                </div>

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
                    <small className="text-danger">
                      {errors?.email?.message}
                    </small>
                  )}
                </Form.Group>

                <Form.Group
                  className="mb-3 position-relative"
                  controlId="formLoginPassword"
                >
                  <div className="d-flex flex-wrap justify-content-between">
                    <Form.Label>Password</Form.Label>

                  </div>

                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    name="password"
                    {...register("password")}
                  />
                  {errors?.password && (
                    <small className="text-danger">
                      {errors?.password?.message}
                    </small>
                  )}

                  <div
                    className="password-show-hide position-absolute"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer", right: "15px", top: "42px" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </div>
                </Form.Group>

                <ButtonMain
                  disable={isLoading}
                  buttonText="Login"
                  iconVisible={false}
                  buttonType="Submit"
                  customClass="w-100 justify-content-center mt-4"
                />
              </Form>


            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AdminLogin;
