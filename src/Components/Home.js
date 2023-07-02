import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Carousel,
} from "react-bootstrap";
import pokeball from "../assets/icons/pokeball.png";
import "./Home.css";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemonsPerPage] = useState(12);

  const [showModal, setShowModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [pokemonDetails, setPokemonDetails] = useState({});
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    axios
      .get("https://pokeapi.co/api/v2/pokemon?limit=1281&offset=0")
      .then((response) => {
        setPokemons(response.data.results);
        setTotalRecords(response.data.count);
        setSearchResults(response.data.results);
        console.log("res", response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const results = pokemons.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
    setCurrentPage(1);
  }, [searchTerm, pokemons]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const totalPages = Math.ceil(searchResults.length / pokemonsPerPage);
  const maxButtons = 5;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const startButton = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    const endButton = Math.min(startButton + maxButtons - 1, totalPages);

    if (startButton > 1) {
      buttons.push(
        <Button key={1} variant="light" onClick={() => handlePageChange(1)}>
          1
        </Button>
      );

      if (startButton > 2) {
        buttons.push(
          <Button key="ellipsis-start" variant="light" disabled>
            ...
          </Button>
        );
      }
    }

    for (let i = startButton; i <= endButton; i++) {
      buttons.push(
        <Button
          key={i}
          variant="light"
          onClick={() => handlePageChange(i)}
          active={currentPage === i}
        >
          {i}
        </Button>
      );
    }

    if (endButton < totalPages) {
      if (endButton < totalPages - 1) {
        buttons.push(
          <Button key="ellipsis-end" variant="light" disabled>
            ...
          </Button>
        );
      }

      buttons.push(
        <Button
          key={totalPages}
          variant="light"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Button>
      );
    }

    return buttons;
  };

  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = searchResults.slice(
    indexOfFirstPokemon,
    indexOfLastPokemon
  );

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPokemon(null);
  };

  const getSinglePokemonDetails = (url) => {
    console.log("url", url);
    axios
      .get(url)
      .then((response) => {
        console.log("res", response);
        setPokemonDetails(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <Container>
        <h1 className="text-center mt-3">Pokemon Directory</h1>

        <Form.Group className="searchbox_wrapper mt-4">
          <Form.Control
            className="custom-search-input"
            type="text"
            placeholder="Search Pokemon"
            value={searchTerm}
            onChange={handleChange}
          />
        </Form.Group>
        <Row className="mt-4">
          {currentPokemons.map((pokemon) => (
            <Col
              key={pokemon.name}
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="mb-4"
            >
              <Card
                className="pokemon-card"
                style={{
                  background: "#f8f8f8",
                  borderRadius: "10px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                  transition: "box-shadow 0",
                }}
              >
                <Card.Img
                  variant="top"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                    pokemon.url.split("/")[6]
                  }.png`}
                  alt="pokemon_img"
                  className="mx-auto mt-3"
                  onClick={() => {
                    setMainImage(
                      `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                        pokemon.url.split("/")[6]
                      }.png`
                    );
                    setSelectedPokemon(pokemon);
                    setShowModal(true);
                    getSinglePokemonDetails(pokemon?.url);
                  }}
                />
                <Card.Body>
                  <Card.Title className="text-center">
                    {pokemon.name}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {totalRecords > pokemonsPerPage && (
          <Row className="mt-4">
            <Col className="pagination_wrapper">
              <Button
                variant="light"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {renderPaginationButtons()}
              <Button
                variant="light"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </Col>
          </Row>
        )}

        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Body>
            <div className="modal-gallery">
              <div className="modal-image">
                {selectedPokemon && (
                  <img
                    src={mainImage}
                    alt="pokemon_img"
                    className="pokemon_modal"
                  />
                )}
              </div>

              <div className="subimg_wrapper">
                <img
                  src={pokemonDetails?.sprites?.back_default}
                  alt="sub_img"
                  onClick={() =>
                    setMainImage(pokemonDetails?.sprites?.back_default)
                  }
                />
                <img
                  className="single_sub_img"
                  src={pokemonDetails?.sprites?.front_default}
                  alt="sub_img"
                  onClick={() =>
                    setMainImage(pokemonDetails?.sprites?.front_default)
                  }
                />
                <img
                  src={pokemonDetails?.sprites?.front_shiny}
                  alt="sub_img"
                  onClick={() =>
                    setMainImage(pokemonDetails?.sprites?.front_shiny)
                  }
                />
              </div>
              <div className="imagedata_wrapper">
                <div>
                  <span className="text_bold">Name:</span>
                  <span> {pokemonDetails?.name}</span>
                </div>
                <div>
                  <span className="text_bold">Order:</span>
                  <span> {pokemonDetails?.order}</span>
                </div>
                <div>
                  <span className="text_bold">Height:</span>
                  <span> {pokemonDetails?.height}</span>
                </div>
                <div>
                  <span className="text_bold">Weight: </span>
                  <span> {pokemonDetails?.weight}</span>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
};

export default Home;
