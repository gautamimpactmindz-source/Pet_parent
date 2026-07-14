"use client";
import "./faqs.css";
import React from "react";
import { Container } from "react-bootstrap";
import Accordion from "react-bootstrap/Accordion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";

const Faqs = ({ faqsData }) => {
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
          start: "top 84%",
          once: true,
        },
      });
    });
  });
  return (
    <section className="section-faqs section-padding bg-color-light">
      <Container>
        <div className="display-4 fw-semibold text-color-text text-center animated-heading mb-5">
          Frequently Asked <span className="text-color-dark">Questions</span>
        </div>
        <Accordion defaultActiveKey="0">
          {faqsData.map((faq, index) => (
            <Accordion.Item
              eventKey={String(index)}
              key={index}
              data-aos="fade-up"
            >
              <Accordion.Header>{faq.question}</Accordion.Header>
              <Accordion.Body>{faq.answer}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};

export default Faqs;
