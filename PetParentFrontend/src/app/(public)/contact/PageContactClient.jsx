"use client";
import "./contact.css";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import ButtonMain from "@/components/button-main/ButtonMain";
import Image from "next/image";
import ButtonGray from "@/components/button-gray/ButtonGray";
import Form from "react-bootstrap/Form";
import ButtonBlue from "@/components/button-blue/ButtonBlue";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faTwitter, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";

const faqsData = [
  {
    question: "Is my pet's data secure?",
    answer:
      "Yes. We use encrypted authentication, secure JWT sessions, and AWS cloud infrastructure to protect your data. Pet images are safely stored in AWS S3.",
  },
  {
    question: "Can I manage multiple pets?",
    answer:
      "Aliquam ac erat vitae mauris laoreet tincidunt. Aliquam pellentesque magna velit, sit amet bibendum justo rutrum ut. In maximus euismod vulputate.",
  },
  {
    question: "What kind of questions can I ask the AI assistant?",
    answer:
      "Integer a tortor nec magna fringilla finibus. Nunc finibus dictum aliquet. Nam iaculis ante ut finibus fermentum. Ut feugiat sed mauris at dapibus.",
  },
  {
    question: " Can I edit or delete activities?",
    answer:
      "Etiam eu ullamcorper lacus. Nunc arcu eros, euismod ut velit et, elementum mattis orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    question: "Does the platform include breed-specific information?",
    answer:
      "Proin fringilla est eget massa tristique facilisis. Praesent rhoncus ligula quis neque suscipit, ac aliquam odio condimentum.",
  },
];

const PageContactClient = () => {
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    // Animated Headings
    const headings = gsap.utils.toArray(".animated-heading");
    console.log(headings);
    headings.forEach((heading) => {
      const split = new SplitText(heading, { type: "words,chars" });
      const chars = split.chars;

      gsap.from(chars, {
        duration: 0.5,
        opacity: 0,
        scale: 0,
        y: 80,
        rotationX: 150,
        transformOrigin: "0% 50% -50",
        ease: "back",
        stagger: 0.01,
        scrollTrigger: {
          trigger: heading,
          start: "top 80%",
          once: true,
        },
      });
    });
  });
  return (
    <>
      <section className="section-help section-padding bg-gradient overflow-hidden">
        <Container>
          <Row className="row-cols-2 rounded-5 bg-color-light p-5">
            <Col>
              <div className="help-left">
                <div className="display-5 fw-semibold animated-heading">
                  We're here <span className="text-color-dark">to Help</span>
                </div>
                <p
                  className="fs-5 mb-2 mt-2 mx-auto"
                  data-aos="fade-in"
                  data-aos-anchor-placement="bottom-bottom"
                  data-aos-delay="300"
                >
                  Have questions about your account, pet management tools, or
                  breed information? Our team is ready to assist you.
                </p>
                <Form className="d-flex flex-wrap flex-column gap-3 form-help mt-4 align-items-start">
                  <Form.Group className="w-100" controlId="formHelpEmail">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter e-mail"
                      className="rounded-5"
                    />
                  </Form.Group>
                  <Form.Group className="w-100" controlId="formHelpSubject">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="General Inquiry"
                      className="rounded-5"
                    />
                  </Form.Group>
                  <Form.Group className="w-100" controlId="formHelpMessage">
                    <Form.Label>Your Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      placeholder="Your message here..."
                      className="rounded-5"
                    />
                  </Form.Group>
                  <ButtonBlue
                    buttonText="Send Message"
                    buttonType="submit"
                    customClass="rounded-pill"
                  />
                </Form>
              </div>
            </Col>
            <Col>
              <div className="help-right">
                <Image
                  src="/images/help.png"
                  alt=""
                  width={367}
                  height={367}
                  className="mx-auto d-block"
                />
                <address className="mx-auto mb-0">
                  <p>151 New Park ave, Hartford, CT 06106 United States</p>
                  <p>
                    <Link href="tel:+1 (203) 302-9545">
                      <FontAwesomeIcon
                        icon={faPhone}
                        width={16}
                        height={16}
                        className="me-2"
                      />
                      +1 (203) 302-9545
                    </Link>
                  </p>
                  <p>
                    <Link href="mailto:contactus@petparenting.com">
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        width={16}
                        height={16}
                        className="me-2"
                      />
                      Contactus@petparenting.com
                    </Link>
                  </p>
                </address>
                <div className="social-icons d-flex gap-4 justify-content-center mt-4">
                  <FontAwesomeIcon icon={faFacebookF} />
                  <FontAwesomeIcon icon={faTwitter} />
                  <FontAwesomeIcon icon={faLinkedinIn} />
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section-quick-help section-padding bg-color-light">
        <Container>
          <div className="display-5 fw-semibold text-center animated-heading">
            Need a <span className="text-color-dark">Quick Help?</span>
          </div>
          <Row className="row-cols-1 row-cols-md-3 mt-5">
            <Col>
              <div className="qh-container text-center h-100 py-3">
                <Image
                  src="/icons/question-mark.svg"
                  alt=""
                  width={26}
                  height={26}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Help Center
                </div>
                <p>Browse FAQs and guides to find quick answers.</p>
              </div>
            </Col>
            <Col>
              <div className="qh-container text-center h-100 py-3">
                <Image
                  src="/icons/assistant.svg"
                  alt=""
                  width={26}
                  height={26}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  AI Assistant
                </div>
                <p>
                  Use our built-in AI chatbot for instant pet-related guidance.
                </p>
              </div>
            </Col>
            <Col>
              <div className="qh-container text-center border-0 h-100 py-3">
                <Image
                  src="/icons/support.svg"
                  alt=""
                  width={26}
                  height={26}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Account Support
                </div>
                <p>
                  For login, password reset, or profile issues, contact support
                  with your registered email.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <Faqs faqsData={faqsData} /> */}
    </>
  );
};

export default PageContactClient;
