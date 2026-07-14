"use client";
import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import ButtonMain from "@/components/button-main/ButtonMain";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import ButtonGray from "@/components/button-gray/ButtonGray";
import Link from "next/link";
import { useGetPetsQuery } from "@/apis/petApi";
const PageHomeClient = () => {


  const trackingPrevRef = useRef(null);
  const trackingNextRef = useRef(null);
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

    // Moving cards
    // const sections = gsap.utils.toArray(".moving-cards");

    // sections.forEach((section) => {
    //   const cards = gsap.utils.toArray(".moving-card");

    //   const tl = gsap.timeline({
    //     scrollTrigger: {
    //       trigger: section,
    //       start: "top top",
    //       end: "+=170%",
    //       scrub: true,
    //       pin: true,
    //       refreshPriority: 1,
    //     },
    //   });

    // animate individually with increasing duration
    // cards.forEach((card, i) => {
    //   tl.to(
    //     card,
    //     {
    //       x: 0,
    //       scale: 1,
    //       ease: "none",
    //       duration: 1 + i * 0.3,
    //     },
    //     0,
    //   );
    // });
    //});

    // Scale section
    gsap.utils.toArray(".scale-section").forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 0.6 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 100%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
    });
  });
  const { data, error } = useGetPetsQuery();

  useEffect(() => {
    console.log(data);
  }, [data])

  return (
    <>
      <section
        className="section-hero-home position-relative z-1"
        data-scroll
        data-scroll-speed="-0.2"
      >
        <Container className="container-big d-flex align-items-center">
          <div>
            <h1 className="text-color-light display-4 fw-semibold animated-heading">
              Everything Your Pet Needs. All in One Place.
            </h1>
            <p
              className="text-color-light fs-5 pe-5 mb-4"
              data-aos="fade-in"
              data-aos-delay="600"
            >
              A smart pet parenting platform that helps you manage your pet's
              profile, track daily activities, explore breed-specific insights,
              and get instant guidance through an AI-powered assistant.
            </p>

            <Link
              href="/"
              className="d-inline-block"
              data-aos="fade-in"
              data-aos-delay="800"
            >
              <ButtonMain buttonText="Get Started for Free" />
            </Link>
          </div>
        </Container>
      </section>
      <section className="section-tracking section-padding bg-gradient position-relative z-1">
        <Container className="container-big">
          <Row className="gx-5">
            <Col md={5}>
              <div className="tracking-left d-flex flex-column align-items-start h-100">
                <div className="text-color-dark fs-2 fw-semibold animated-heading">
                  Pet parenting is confusing, emotional, and constant
                </div>
                <div
                  className="d-flex flex-column align-items-start flex-grow-1"
                  data-aos="fade-in"
                  data-aos-delay="700"
                >
                  <p className="mt-2 pe-5 mb-4">
                    We help you understand what your pet needs — every day
                  </p>
                  <Link href="/" className="d-inline-block">
                    <ButtonMain
                      buttonText="Start tracking your pet"
                      customClass="mb-5"
                    />
                  </Link>
                  <div className="swiper-tracking-nav mt-auto">
                    <button
                      ref={trackingPrevRef}
                      className="rounded-circle me-2"
                    >
                      <FontAwesomeIcon
                        icon={faAngleLeft}
                        width={20}
                        height={16}
                      />
                    </button>
                    <button ref={trackingNextRef} className="rounded-circle">
                      <FontAwesomeIcon
                        icon={faAngleRight}
                        width={20}
                        height={16}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={7}>
              <div
                className="tracking-right"
                data-aos="fade-left"
                data-aos-delay="600"
                data-aos-duration="800"
              >
                <Swiper
                  spaceBetween={35}
                  breakpoints={{
                    1400: {
                      slidesPerView: 1.7,
                    },
                    1600: {
                      slidesPerView: 2.7,
                    },
                  }}
                  modules={[Navigation]}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = trackingPrevRef.current;
                    swiper.params.navigation.nextEl = trackingNextRef.current;
                  }}
                >
                  <SwiperSlide>
                    <div className="tracking-container rounded-5 bg-color-light p-5">
                      <Image
                        src="/icons/puppy.svg"
                        alt=""
                        width={34}
                        height={27}
                        className="mb-3"
                      />
                      <div className="fs-4 fw-semibold text-color-dark">
                        Everything about your pet, remembered
                      </div>
                      <p className="mt-2 mb-4">
                        Store and manage all your pet's essential
                        information—including profiles, health notes, care
                        reminders, and photo memories—in one secure,
                        easy-to-access dashboard designed for stress-free pet
                        parenting.
                      </p>
                      <ButtonGray buttonText="View Example" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tracking-container rounded-5 bg-color-light p-5">
                      <Image
                        src="/icons/puppy.svg"
                        alt=""
                        width={34}
                        height={27}
                        className="mb-3"
                      />
                      <div className="fs-4 fw-semibold text-color-dark">
                        Everything about your pet, remembered
                      </div>
                      <p className="mt-2 mb-4">
                        Store and manage all your pet's essential
                        information—including profiles, health notes, care
                        reminders, and photo memories—in one secure,
                        easy-to-access dashboard designed for stress-free pet
                        parenting.
                      </p>
                      <ButtonGray buttonText="View Example" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tracking-container rounded-5 bg-color-light p-5">
                      <Image
                        src="/icons/puppy.svg"
                        alt=""
                        width={34}
                        height={27}
                        className="mb-3"
                      />
                      <div className="fs-4 fw-semibold text-color-dark">
                        Everything about your pet, remembered
                      </div>
                      <p className="mt-2 mb-4">
                        Store and manage all your pet's essential
                        information—including profiles, health notes, care
                        reminders, and photo memories—in one secure,
                        easy-to-access dashboard designed for stress-free pet
                        parenting.
                      </p>
                      <ButtonGray buttonText="View Example" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tracking-container rounded-5 bg-color-light p-5">
                      <Image
                        src="/icons/puppy.svg"
                        alt=""
                        width={34}
                        height={27}
                        className="mb-3"
                      />
                      <div className="fs-4 fw-semibold text-color-dark">
                        Everything about your pet, remembered
                      </div>
                      <p className="mt-2 mb-4">
                        Store and manage all your pet's essential
                        information—including profiles, health notes, care
                        reminders, and photo memories—in one secure,
                        easy-to-access dashboard designed for stress-free pet
                        parenting.
                      </p>
                      <ButtonGray buttonText="View Example" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tracking-container rounded-5 bg-color-light p-5">
                      <Image
                        src="/icons/puppy.svg"
                        alt=""
                        width={34}
                        height={27}
                        className="mb-3"
                      />
                      <div className="fs-4 fw-semibold text-color-dark">
                        Everything about your pet, remembered
                      </div>
                      <p className="mt-2 mb-4">
                        Store and manage all your pet's essential
                        information—including profiles, health notes, care
                        reminders, and photo memories—in one secure,
                        easy-to-access dashboard designed for stress-free pet
                        parenting.
                      </p>
                      <ButtonGray buttonText="View Example" />
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <div className="tracking-container rounded-5 bg-color-light p-5">
                      <Image
                        src="/icons/puppy.svg"
                        alt=""
                        width={34}
                        height={27}
                        className="mb-3"
                      />
                      <div className="fs-4 fw-semibold text-color-dark">
                        Everything about your pet, remembered
                      </div>
                      <p className="mt-2 mb-4">
                        Store and manage all your pet's essential
                        information—including profiles, health notes, care
                        reminders, and photo memories—in one secure,
                        easy-to-access dashboard designed for stress-free pet
                        parenting.
                      </p>
                      <ButtonGray buttonText="View Example" />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section-why-exists section-padding bg-color-primary moving-cards">
        <Container className="container-big">
          <div className="text-color-light display-4 fw-semibold animated-heading">
            Why this Exists
          </div>
          <p
            className="text-color-light fs-5 mb-5 mt-2"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            We help you understand what your pet needs — every day
          </p>
          <Row className="row-cols-1 row-cols-md-3">
            <Col
              className="moving-card"
              data-aos="fade-up"
              data-aos-duration="800"
            >
              <div className="we-container rounded-5 overflow-hidden h-100 position-relative">
                <Image
                  src="/images/rtj54.jpg"
                  alt=""
                  width={392}
                  height={479}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-3 position-absolute p-4 top-0 w-100 fw-bold text-color-light z-2">
                  Pets cannot speak
                </div>
              </div>
            </Col>
            <Col
              className="moving-card"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="100"
            >
              <div className="we-container rounded-5 overflow-hidden h-100 position-relative">
                <Image
                  src="/images/qz83.jpg"
                  alt=""
                  width={392}
                  height={479}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-3 position-absolute p-4 top-0 w-100 fw-bold text-color-light z-2">
                  Humans react late
                </div>
              </div>
            </Col>
            <Col
              className="moving-card"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay="200"
            >
              <div className="we-container rounded-5 overflow-hidden h-100 position-relative">
                <Image
                  src="/images/ajk20.jpg"
                  alt=""
                  width={392}
                  height={479}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-3 position-absolute p-4 top-0 w-100 fw-bold text-color-light z-2">
                  Small signals matter
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section-ai-features section-padding pb-0 bg-gradient overflow-hidden">
        <Container>
          <div className="display-4 fw-semibold text-color-dark text-center animated-heading">
            Smart AI <span className="text-color-text">Features</span>
          </div>
          <p
            className="text-color-dark fs-5 mb-5 text-center mt-2"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            We help you understand what your pet needs — every day
          </p>
          <Row
            className="row-cols-1 row-cols-md-3 gy-4"
            data-aos="fade-up"
            data-aos-duration="800"
          >
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
                  Activity & Care Logs
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
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/image-upload.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Pet Image Uploads
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
                  Activity & Care Logs
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
            <Col>
              <div className="ai-feature p-4 rounded-2 bg-color-light shadow-sm bg-color-light">
                <Image
                  src="/icons/image-upload.svg"
                  alt=""
                  width={51}
                  height={51}
                  className="mb-4"
                />
                <div className="fs-5 text-color-dark fw-semibold mb-2">
                  Pet Image Uploads
                </div>
                <p className="mb-0">
                  We provide a mix of popular brands and healthy alternatives,
                  including fresh foods , salads
                </p>
              </div>
            </Col>
          </Row>
          <Image
            src="/images/jzp30.png"
            alt=""
            width={870}
            height={553}
            style={{ height: "auto" }}
            className="mx-auto d-block rounded-top"
            data-scroll
            data-scroll-speed="-0.06"
          />
        </Container>
      </section>
      <section className="section-unique section-padding bg-color-light">
        <Container>
          <div className="display-4 fw-semibold text-center animated-heading">
            Every Dog is <span className="text-color-dark">Unique</span>
          </div>
          <p
            className="text-color-dark fs-5 mb-5 text-center mt-2"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            We help you understand what your pet needs — every day
          </p>
          <Row className="gy-4">
            <Col md={4}>
              <div className="unique-container rounded-4 p-3 bg-color-tertiary h-100 d-flex flex-column align-items-start">
                <div className="text-color-dark fw-bold mb-1">
                  Breed Overview & Characteritsics
                </div>
                <p>
                  Understand temperament, personality traits, and defining
                  physical features.
                </p>
                <div className="mt-auto rounded-4 overflow-hidden w-100">
                  <div
                    className="parallax-image"
                    data-scroll
                    data-scroll-speed="-0.06"
                  >
                    <Image
                      src="/images/ur76.jpg"
                      alt=""
                      width={325}
                      height={300}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        transform: "scale(1.2)",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={8}>
              <div className="unique-container rounded-4 p-3 bg-color-tertiary h-100 d-flex flex-column align-items-start">
                <div className="text-color-dark fw-bold mb-1">
                  Care and grooming guidance
                </div>
                <p>
                  Understand temperament, personality traits, and defining
                  physical features.
                </p>
                <div className="mt-auto rounded-4 overflow-hidden w-100">
                  <div
                    className="parallax-image"
                    data-scroll
                    data-scroll-speed="-0.06"
                  >
                    <Image
                      src="/images/hw14.jpg"
                      alt=""
                      width={713}
                      height={312}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        transform: "scale(1.2)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="unique-container rounded-4 p-3 bg-color-tertiary h-100 d-flex flex-column align-items-start">
                <div className="text-color-dark fw-bold mb-1">
                  Activity and Lifestyle Needs
                </div>
                <p>
                  Understand temperament, personality traits, and defining
                  physical features.
                </p>
                <div className="mt-auto rounded-4 overflow-hidden w-100">
                  <div
                    className="parallax-image"
                    data-scroll
                    data-scroll-speed="-0.06"
                  >
                    <Image
                      src="/images/se1y.jpg"
                      alt=""
                      width={325}
                      height={300}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        transform: "scale(1.2)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="unique-container rounded-4 p-3 bg-color-tertiary h-100 d-flex flex-column align-items-start">
                <div className="text-color-dark fw-bold mb-1">
                  Ideal Environment Suggessions
                </div>
                <p>
                  Understand temperament, personality traits, and defining
                  physical features.
                </p>
                <div className="mt-auto rounded-4 overflow-hidden w-100">
                  <div
                    className="parallax-image"
                    data-scroll
                    data-scroll-speed="-0.06"
                  >
                    <Image
                      src="/images/ne5s.jpg"
                      alt=""
                      width={325}
                      height={300}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        transform: "scale(1.2)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
            <Col md={4}>
              <div className="unique-container rounded-4 p-3 bg-color-tertiary h-100 d-flex flex-column align-items-start">
                <div className="text-color-dark fw-bold mb-1">
                  Health considerations & lifespan
                </div>
                <p>
                  Understand temperament, personality traits, and defining
                  physical features.
                </p>
                <div className="mt-auto rounded-4 overflow-hidden w-100">
                  <div
                    className="parallax-image"
                    data-scroll
                    data-scroll-speed="-0.06"
                  >
                    <Image
                      src="/images/al8d.jpg"
                      alt=""
                      width={325}
                      height={300}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        transform: "scale(1.2)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <section className="section-get-started section-padding pt-3 bg-gradient px-3">
        <Container
          fluid
          className="rounded-5 bg-color-primary p-5 scale-section"
        >
          <Row className="row-cols-1 row-cols-md-2">
            <Col>
              <div className="text-color-light display-4 fw-semibold animated-heading">
                Get Started in Minutes
              </div>
              <p
                className="text-color-light fs-5 mb-5 mt-2"
                data-aos="fade-in"
                data-aos-anchor-placement="bottom-bottom"
                data-aos-delay="300"
              >
                As your pet's data grows, clarity replaces guesswork
              </p>
              <Image
                src="/images/jeq34.png"
                alt=""
                width={690}
                height={412}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 35px #3668a6)",
                }}
              />
            </Col>
            <Col>
              <Row className="row-cols-2 gy-4">
                <Col>
                  <div className="step-container rounded-4 p-3 text-color-light">
                    <Image
                      src="/icons/activity-log.svg"
                      alt=""
                      width={51}
                      height={51}
                      className="mb-4"
                    />
                    <div className="fs-5 fw-semibold mb-2 text-capitalize">
                      Sign up securely
                    </div>
                    <p className="mb-0">Add mail</p>
                  </div>
                </Col>
                <Col>
                  <div className="step-container rounded-4 p-3 text-color-light">
                    <Image
                      src="/icons/activity-log.svg"
                      alt=""
                      width={51}
                      height={51}
                      className="mb-4"
                    />
                    <div className="fs-5 fw-semibold mb-2 text-capitalize">
                      Add your pet
                    </div>
                    <p className="mb-0">Build Profile</p>
                  </div>
                </Col>
                <Col>
                  <div className="step-container rounded-4 p-3 text-color-light">
                    <Image
                      src="/icons/activity-log.svg"
                      alt=""
                      width={51}
                      height={51}
                      className="mb-4"
                    />
                    <div className="fs-5 fw-semibold mb-2 text-capitalize">
                      Track and Learn
                    </div>
                    <p className="mb-0">Activity Logs</p>
                  </div>
                </Col>
                <Col>
                  <div className="step-container rounded-4 p-3 text-color-light">
                    <Image
                      src="/icons/activity-log.svg"
                      alt=""
                      width={51}
                      height={51}
                      className="mb-4"
                    />
                    <div className="fs-5 fw-semibold mb-2 text-capitalize">
                      Manage with ease
                    </div>
                    <p className="mb-0">Ready to go</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
        <Container className="container-big mt-5">
          <div className="display-4 fw-semibold text-center text-color-dark animated-heading">
            What You'll Notice Over Time
          </div>
          <p
            className="text-color-dark fs-5 mb-5 text-center mt-2"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            As your pet's data grows, clarity replaces guesswork
          </p>
          <div
            className="time-bar d-flex align-items-center justify-content-evenly mb-5"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="500"
          >
            <span className="text-color-dark fw-bold d-inline-block position-relative">
              Day 1
            </span>
            <span className="text-color-dark fw-bold d-inline-block position-relative">
              Week 2
            </span>
            <span className="text-color-dark fw-bold d-inline-block position-relative">
              Month 1
            </span>
            <span className="text-color-dark fw-bold d-inline-block position-relative">
              Ongoing
            </span>
          </div>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4">
            <Col>
              <div
                className="notice-container rounded-5 shadow-sm bg-color-light px-4 py-5 text-center h-100"
                data-aos="fade-up"
                data-aos-duration="800"
              >
                <Image
                  src="/icons/pattern.svg"
                  alt=""
                  width={105}
                  height={105}
                  className="mb-4"
                />
                <div className="fs-3 fw-semibold text-color-dark mb-2">
                  You'll start noticing patterns
                </div>
                <p className="mb-0">
                  Spot subtle changes in sleep, appetite, and behaviour before
                  they turn into bigger concerns
                </p>
              </div>
            </Col>
            <Col>
              <div
                className="notice-container rounded-5 shadow-sm bg-color-light px-4 py-5 text-center h-100"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="100"
              >
                <Image
                  src="/icons/understand.svg"
                  alt=""
                  width={105}
                  height={105}
                  className="mb-4"
                />
                <div className="fs-3 fw-semibold text-color-dark mb-2">
                  You'll react less, understand more
                </div>
                <p className="mb-0">
                  Gain clarity on what's normal and what needs attention, so you
                  can respond with confidence.
                </p>
              </div>
            </Col>
            <Col>
              <div
                className="notice-container rounded-5 shadow-sm bg-color-light px-4 py-5 text-center h-100"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="200"
              >
                <Image
                  src="/icons/vet-visits.svg"
                  alt=""
                  width={105}
                  height={105}
                  className="mb-4"
                />
                <div className="fs-3 fw-semibold text-color-dark mb-2">
                  Vet visits become clearer
                </div>
                <p className="mb-0">
                  Walk into appointments prepared with accurate history and
                  meaningful insights.
                </p>
              </div>
            </Col>
            <Col>
              <div
                className="notice-container rounded-5 shadow-sm bg-color-light px-4 py-5 text-center h-100"
                data-aos="fade-up"
                data-aos-duration="800"
                data-aos-delay="300"
              >
                <Image
                  src="/icons/calm.svg"
                  alt=""
                  width={105}
                  height={105}
                  className="mb-4"
                />
                <div className="fs-3 fw-semibold text-color-dark mb-2">
                  Your dog feels calmer
                </div>
                <p className="mb-0">
                  Consistent routines and better understanding lead to a
                  happier, more relaxed companion.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default PageHomeClient;
