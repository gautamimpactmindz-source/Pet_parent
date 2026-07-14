"use client";
import Link from "next/link";
import { Container } from "react-bootstrap";
import Image from "next/image";
import ButtonBlue from "@/components/button-blue/ButtonBlue";

export default function PageNotFound() {
  return (
    <>
      <section className="section-error404 text-center section-padding bg-color-light">
        <Container className="mt-5">
          <Image
            src="/images/404.jpg"
            width={240}
            height={200}
            alt=""
            style={{ maxWidth: "100%", objectFit: "contain" }}
            className="mt-5"
          />
          <h1 className="display-2 fw-semibold lh-1 mt-3 mb-0 text-color-dark">
            Oops!
          </h1>
          <p className="fs-2 mt-3">
            We can't seem to find the page you're looking for.
          </p>
          <Link href="/" className="d-inline-block mt-4">
            <ButtonBlue buttonText="Go to Homepage" />
          </Link>
        </Container>
      </section>
    </>
  );
}
