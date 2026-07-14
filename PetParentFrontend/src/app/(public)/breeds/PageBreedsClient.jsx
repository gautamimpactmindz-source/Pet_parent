"use client";
import "./breeds.css";
import React, { useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger, SplitText } from "gsap/all";
import ButtonMain from "@/components/button-main/ButtonMain";
import Image from "next/image";
import ButtonGray from "@/components/button-gray/ButtonGray";
import Form from "react-bootstrap/Form";
import { useGetAllBreedQuery } from "@/apis/BreedApi";
import ButtonBlue from "@/components/button-blue/ButtonBlue";

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

const PageBreedsClient = () => {
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


  const { data, isLoading, isError } = useGetAllBreedQuery();

  const breeds = data?.data || [];

  const [searchName, setSearchName] = useState("");

  const filteredBreeds = useMemo(() => {
    return breeds.filter((breed) => {
      const breedName = breed?.name ?? "";

      const nameMatch =
        searchName === "" ||
        breedName.toLowerCase().includes(searchName.toLowerCase());
      return nameMatch

    });
  }, [breeds, searchName]);


  return (
    <>
      <section className="section-discover-breed section-padding bg-gradient overflow-hidden">
        <Container className="container-big">
          <div className="display-5 fw-semibold text-center animated-heading">
            Discover the <span className="text-color-dark">Perfect Breed</span>{" "}
            for Your Lifestyle Platform
          </div>
          <p
            className="text-color-dark fs-5 mb-2 text-center mt-2 mx-auto"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            Explore detailed, easy-to-understand breed profiles designed to help
            you make informed decisions and care confidently for your pet.
          </p>
          <div className="fs-3 fw-semibold text-center text-color-dark mb-5">
            Search, compare, and learn — all in one place.
          </div>
          <Form className="d-flex flex-wrap gap-3 form-search-breed bg-color-light rounded-4 p-4 mx-auto" onSubmit={(e) => e.preventDefault()}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search Breed by Name"
                id="formSearchBreedName"
                onChange={(e) => setSearchName(e.target.value)}
              />
            </Form.Group>
            {/* <Form.Group>
              <Form.Select id="formSearchBreedSize">
                <option>Size</option>
                <option value="Small">Small</option>
                <option value="Medium">Medium</option>
                <option value="Large">Large</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Select id="formSearchBreedEnergyLevel" onChange={(e) => setenergyFilter(e.target.value)}>
                <option>Energy Level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Select id="formSearchBreedBehaviour" onChange={(e) => setfamilyFilter(e.target.value)}>
                <option>Family Friendly</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                {/* <option value="3">Three</option> */}
            {/* </Form.Select>
  </Form.Group> */
            } 
            <ButtonBlue buttonText="Search Breed" buttonType="submit" />
          </Form >
        </Container >
      </section >
      <section className="section-browse-breeds section-padding bg-color-secondary-light">
        <Container className="container-big">
          <div className="display-5 fw-semibold text-center animated-heading">
            Browse <span className="text-color-dark">Breeds</span>
          </div>
          <p
            className="fs-5 mb-2 text-center mt-2 mx-auto"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            Explore detailed, easy-to-understand breed profiles designed to help
            you make informed decisions and care confidently for your pet.
          </p>
          <div className="fs-3 fw-semibold text-center text-color-dark mb-5">
            Every breed page includes
          </div>
          <Row className="row-cols-1 row-cols-3 g-4">


            {isLoading && (
              <p className="text-center w-100">Loading breeds...</p>
            )}

            {isError && (
              <p className="text-danger text-center w-100">
                Failed to load breeds
              </p>
            )}

            {!isLoading &&
              filteredBreeds.map((breed) => (
                <Col key={breed._id}>
                  <div className="breed-container p-4 rounded-4 bg-color-light h-100 d-flex flex-column">


                    <div className="breed-image">
                      <Image
                        src={breed?.BreedImage?.url || "/images/placeholder.png"}
                        alt={breed?.name}

                        width={500}
                        height={400}

                        className="breed-img rounded-3"
                      />


                    </div>

                    <div className="fs-5 text-color-dark fw-semibold mb-2 mt-3">
                      {breed.name}
                    </div>

                    <p>{breed.excerpt}</p>

                    <div className="tags mb-3 d-flex flex-wrap gap-2">

                      {breed.size && (
                        <span className="tag bg-color-secondary-light rounded-2 py-2 px-3">
                          {breed.size}
                        </span>
                      )}

                      {breed.energy && (
                        <span className="tag bg-color-secondary-light rounded-2 py-2 px-3">
                          {breed.energy}
                        </span>
                      )}

                      {breed.goodwith && (
                        <span className="tag bg-color-secondary-light rounded-2 py-2 px-3">
                          {breed.goodwith}
                        </span>
                      )}

                    </div>

                    <Link href={""}>
                      <ButtonGray buttonText="View Full Guide" />
                    </Link>

                  </div>
                </Col>
              ))}

          </Row>

          <div className="text-center mt-5">
            <ButtonMain buttonText="View All Breeds" />
          </div>
        </Container>
      </section>
      <section className="section-breed-guide section-padding bg-color-light">
        <Container className="container-big">
          <div className="display-5 fw-semibold text-center animated-heading">
            Why our <span className="text-color-dark">Breed Guide</span> Matters
          </div>
          <p
            className="fs-5 mb-2 text-center mt-2 mx-auto"
            data-aos="fade-in"
            data-aos-anchor-placement="bottom-bottom"
            data-aos-delay="300"
          >
            Built for reliability. Designed for modern pet parents.
          </p>
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-4 mt-5">
            <Col>
              <div className="guide-container overflow-hidden position-relative">
                <Image
                  src="/images/lifestyle.jpg"
                  alt=""
                  width={339}
                  height={183}
                  className="rounded-3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-4 fw-semibold text-color-light position-absolute top-auto bottom-0 bg-color-primary">
                  Lifestyle match
                </div>
              </div>
            </Col>
            <Col>
              <div className="guide-container overflow-hidden position-relative">
                <Image
                  src="/images/lifestyle.jpg"
                  alt=""
                  width={339}
                  height={183}
                  className="rounded-3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-4 fw-semibold text-color-light position-absolute top-auto bottom-0 bg-color-primary">
                  Lifestyle match
                </div>
              </div>
            </Col>
            <Col>
              <div className="guide-container overflow-hidden position-relative">
                <Image
                  src="/images/lifestyle.jpg"
                  alt=""
                  width={339}
                  height={183}
                  className="rounded-3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-4 fw-semibold text-color-light position-absolute top-auto bottom-0 bg-color-primary">
                  Lifestyle match
                </div>
              </div>
            </Col>
            <Col>
              <div className="guide-container overflow-hidden position-relative">
                <Image
                  src="/images/lifestyle.jpg"
                  alt=""
                  width={339}
                  height={183}
                  className="rounded-3"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <div className="fs-4 fw-semibold text-color-light position-absolute top-auto bottom-0 bg-color-primary">
                  Lifestyle match
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* <Faqs faqsData={faqsData} /> */}
    </>
  );
};


export default PageBreedsClient;
