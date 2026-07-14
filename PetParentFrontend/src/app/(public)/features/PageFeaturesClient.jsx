"use client";
import "./features.css";
import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import ButtonMain from "@/components/button-main/ButtonMain";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonGray from "@/components/button-gray/ButtonGray";
import Link from "next/link";
import Faqs from "@/components/faqs/Faqs";

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

const PageFeaturesClient = () => {
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
      <section
        className="section-hero-features position-relative z-1"
        data-scroll
        data-scroll-speed="-0.2"
      >
        <Container className="container-big d-flex align-items-center">
          <div>
            <h1 className="text-color-light display-4 fw-semibold animated-heading">
              Everything Your Need for Smarter Pet Parenting
            </h1>
            <p
              className="text-color-light fs-5 pe-5 mb-4"
              data-aos="fade-in"
              data-aos-delay="600"
            >
              Manage pet profiles, track activities, explore breed insights, and
              get AI-powered support — all in one secure platform.
            </p>
            <Link
              href="/"
              className="d-inline-block"
              data-aos="fade-in"
              data-aos-delay="800"
            >
              <ButtonMain buttonText="Start Managing Your Pet Today" />
            </Link>
          </div>
        </Container>
      </section>
      <section className="section-benefits section-padding bg-color-light position-relative z-1">
        <Container>
          <div className="display-4 fw-semibold text-color-text text-center animated-heading">
            Core <span className="text-color-dark">Benefits</span>
          </div>
          <p
            className="text-color-dark fs-5 mb-5 text-center mt-2"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            Everything about your pet — structured, secure, and accessible.
          </p>
        </Container>
        <div className="cb-wrap">
          <Row>
            <Col md={5}>
              <div className="cb-left d-flex flex-column align-items-start gap-4">
                <div
                  className="rounded-2 py-3 px-4 bg-color-secondary-light lh-1"
                  data-aos="fade-up"
                >
                  Pet Profiles + Activity Tracking
                </div>
                <div
                  className="cb-container position-relative rounded-2 bg-color-tertiary w-100"
                  data-aos="fade-up"
                >
                  <Image
                    src="/icons/edit.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="position-absolute"
                  />
                  <div className="cb-text">
                    <div className="fs-5 text-color-dark fw-semibold mb-2">
                      AI-Powered Pet Assistant
                    </div>
                    <p className="mb-0">
                      We provide a mix of popular brands and healthy
                      alternatives, including fresh foods , salads
                    </p>
                  </div>
                </div>
                <div
                  className="cb-container position-relative rounded-2 bg-color-tertiary w-100"
                  data-aos="fade-up"
                >
                  <Image
                    src="/icons/user-plus.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="position-absolute"
                  />
                  <div className="cb-text">
                    <div className="fs-5 text-color-dark fw-semibold mb-2">
                      Add, edit, or delete multiple pets
                    </div>
                    <p className="mb-0">
                      Manage all your pets effortlessly from a single dashboard.
                    </p>
                  </div>
                </div>
                <div
                  className="cb-container position-relative rounded-2 bg-color-tertiary w-100"
                  data-aos="fade-up"
                >
                  <Image
                    src="/icons/calendar.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="position-absolute"
                  />
                  <div className="cb-text">
                    <div className="fs-5 text-color-dark fw-semibold mb-2">
                      Log walks, meals, medications & vet visits
                    </div>
                    <p className="mb-0">
                      Keep track of daily routines and important health
                      activities with ease.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={7}>
              <div className="cb-right overflow-hidden">
                <Image
                  src="/images/lei3n.jpg"
                  alt=""
                  width={853}
                  height={516}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            </Col>
          </Row>
        </div>
      </section>
      <section className="section-ai-features section-padding bg-color-primary overflow-hidden">
        <Container>
          <div className="display-4 fw-semibold text-color-light text-center animated-heading mb-5">
            AI Intelligence
          </div>
          <Row
            className="row-cols-1 row-cols-md-3 gy-4"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/pet-assistant.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  AI-Powered Pet Assistant
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/safe-response.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Safe-Response Framework
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/breed-intelligence.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Breed Intelligence Engine
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/recommendations.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Smart Recommendations
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/activity-log.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Continuous Learning
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/pet-profile.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Pet Profiles
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section-ai-features section-padding bg-gradient overflow-hidden">
        <Container>
          <div className="display-4 fw-semibold text-color-dark text-center animated-heading">
            Secure <span className="text-color-text">Platform</span>
          </div>
          <p
            className="text-color-dark fs-5 mb-5 text-center mt-2"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            Built for reliability. Designed for modern pet parents.
          </p>
          <Row
            className="row-cols-1 row-cols-md-3 gy-4"
            data-aos="fade-up"
            data-aos-duration="800"
          >
            <Col>
              <div className="ai-feature h-100 p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/secure.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Secure Authentication <small>(JWT-Based)</small>
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature h-100 p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/access-control.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Role-Based Access Control
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
            <Col>
              <div className="ai-feature h-100 p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/admin.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Admin Control Panel
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <Faqs faqsData={faqsData} />
    </>
  );
};

export default PageFeaturesClient;
