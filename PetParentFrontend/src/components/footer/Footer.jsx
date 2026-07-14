"use client";
import { Container, Row, Col } from "react-bootstrap";
import "./footer.css";
import React from "react";
import Image from "next/image";
import ButtonMain from "../button-main/ButtonMain";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="text-color-light bg-color-primary pb-5 position-fixed bottom-0 start-0 end-0 z-n1">
      <Container className="container-big">
        <div className="ftr-top text-center">
          <Image
            src="/images/logo-secondary.svg"
            alt=""
            width={332}
            height={50}
            className="mb-4"
          />
          <div className="fs-3 fw-bold mb-3">
            Start Your Pet Parenting Journey Today
          </div>
          <p className="mb-4">
            Join a smarter way to care, track, and connect with your pet -
            powered by technology, guided by love.
          </p>
          <ButtonMain buttonText="Start tracking your pet" />
        </div>
        <div className="ftr-middle py-5 my-5">
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4">
            <Col className="ps-5">
              <div className="fw-bold text-color-secondary position-relative">
                Company
              </div>
              <ul className="ls-none d-flex flex-column align-items-start gap-3 mt-3">
                <li>
                  <Link href="/">About</Link>
                </li>
                <li>
                  <Link href="/">Features</Link>
                </li>
                <li>
                  <Link href="/">Breeds</Link>
                </li>
                <li>
                  <Link href="/">Contact Us</Link>
                </li>
              </ul>
            </Col>
            <Col className="ps-5">
              <div className="fw-bold text-color-secondary position-relative">
                Follow Us
              </div>
              <ul className="ls-none d-flex flex-column align-items-start gap-3 mt-3">
                <li>
                  <Link href="/">Instagram</Link>
                </li>
                <li>
                  <Link href="/">Facebook</Link>
                </li>
                <li>
                  <Link href="/">Whatsapp</Link>
                </li>
                <li>
                  <Link href="/">Linkedin</Link>
                </li>
              </ul>
            </Col>
            <Col className="ps-5">
              <div className="fw-bold text-color-secondary position-relative">
                Contact Us
              </div>
              <ul className="ls-none d-flex flex-column align-items-start gap-3 mt-3">
                <li>
                  <Link href="mailto:support@petparenting.com">
                    support@petparenting.com
                  </Link>
                </li>
                <li>
                  <Link href="tel:+919876543210">+91 98765 43210</Link>
                </li>
              </ul>
              <address className="mt-3">
                Pet Parenting 3rd Floor, Green Park Plaza
              </address>
            </Col>
            <Col className="ps-5">
              <div className="fw-bold text-color-secondary position-relative">
                Privacy Policy
              </div>
              <ul className="ls-none d-flex flex-column align-items-start gap-3 mt-3">
                <li>
                  <Link href="/">Consult</Link>
                </li>
                <li>
                  <Link href="/">Terms & Conditions</Link>
                </li>
              </ul>
            </Col>
          </Row>
        </div>
        <div className="ftr-bottom text-center">
          &copy; 2026 Pet Parenting Platform. Designed for responsible pet care.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
