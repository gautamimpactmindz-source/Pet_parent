"use client";
import "./header.css";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Container } from "react-bootstrap";
import ButtonGray from "../button-gray/ButtonGray";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return null;
  }
  return (
    <header className="z-3 position-fixed top-0 start-0 end-0">
      <Container className="container-big d-flex flex-wrap align-items-center justify-content-between py-2">
        <Link href="/" className="d-inline-block">
          <Image src="/images/logo.svg" alt="Logo" width={171} height={28} />
        </Link>
        <div className="hdr-buttons">
          <Link href="/" className="d-inline-block me-4">
            <FontAwesomeIcon
              icon={faDownload}
              className="me-1"
              width={20}
              height={16}
            />
            Download App
          </Link>
          <Link href="/" className="d-inline-block me-4">
            <FontAwesomeIcon
              icon={faCircleQuestion}
              className="me-1"
              width={20}
              height={16}
            />
            Support
          </Link>
          <Link href="/login">
            <ButtonGray buttonIcon="user" buttonText="Login" />
          </Link>
        </div>
      </Container>
      <Navbar expand="lg" className="p-0 bg-color-primary">
        <Container className="container-big">
          <Navbar.Toggle aria-controls="offcanvasNavbar" />
          <Navbar.Offcanvas
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            placement="end"
          >
            <Offcanvas.Header closeButton></Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="flex-grow-1 gap-5">
                <Nav.Link
                  as={Link}
                  href="/"
                  className={pathname === "/" ? "active-link" : ""}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/features"
                  className={pathname === "/features" ? "active-link" : ""}
                >
                  Features
                </Nav.Link>
                <NavDropdown title="Breeds" id="dropdownBreeds">
                  <NavDropdown.Item
                    as={Link}
                    href="/breeds/beagle"
                    className={
                      pathname === "/breeds/beagle" ? "active-link" : ""
                    }
                  >
                    Beagle
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    href="/breeds/golden-retriever"
                    className={
                      pathname === "/breeds/golden-retriever"
                        ? "active-link"
                        : ""
                    }
                  >
                    Golden Retriever
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    href="/breeds/siberian-husky"
                    className={
                      pathname === "/breeds/siberian-husky" ? "active-link" : ""
                    }
                  >
                    Siberian Husky
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    as={Link}
                    href="/breeds/german-shepherd"
                    className={
                      pathname === "/breeds/german-shephard"
                        ? "active-link"
                        : ""
                    }
                  >
                    German Shepherd
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link
                  as={Link}
                  href="/about"
                  className={pathname === "/about" ? "active-link" : ""}
                >
                  About
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  href="/contact"
                  className={pathname === "/contact" ? "active-link" : ""}
                >
                  Contact
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
