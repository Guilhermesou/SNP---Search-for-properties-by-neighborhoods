import React, { useEffect, useState, useRef } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import axios from "axios";
import {
  Container,
  Box,
  CircularProgress,
  Button,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Flex
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons"

const token =
  "pk.eyJ1IjoiZ3VpbGhlcm1lLWxlYW4iLCJhIjoiY2t2d3RkdHRuMDBjdTJvb2JmZm85N2JqbCJ9.aLyEbMYT5ds0tQdgkNjPiA";

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef<HTMLButtonElement>(null);
  function DrawerComponent() {
    
    return (
      <>
        <Button
          leftIcon={<HamburgerIcon />}
          bg="#CBD5E0"
          color="#171923"
          onClick={onOpen}
          className="menu"
          ref={btnRef}
        >
          Open
        </Button>
        <Drawer
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          finalFocusRef={btnRef}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </>
    );
  }
  function CardPop(props: Card) {
    return (
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box p="6">
          <Box
            mt="1"
            fontWeight="semibold"
            as="h4"
            lineHeight="tight"
            isTruncated
          >
            {props.title}
          </Box>

          <Box>
            {intlMonetary.format(props.value)}
            <Box as="span" color="gray.600" fontSize="sm" />
          </Box>
        </Box>
      </Box>
    );
  }
  //const { toggleColorMode } = useColorMode();
  useEffect(() => {
    DrawerComponent()
  })
  const [currentPlaceId, setCurrentPlaceId] = useState<String>("");
  const [viewport, setViewport] = useState({
    longitude: -60.68,
    latitude: 2.86,
    zoom: 13,
  });
  
  interface Place {
    id: string;
    nome: string;
    location: {
      latitude: string;
      longitude: string;
    };
    average?: number;
  }
 
  interface Card {
      title: string,
      value: number
  }
  
  const intlMonetary = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  
  const handleMarkerClick = (id: string) => {
    setCurrentPlaceId(id)
  }
  
  const [neighbor, setNeighbor] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  function getData() {
    axios
      .get("http://localhost:4000/bairros")
      .then((data) => {
        setNeighbor(data.data.payload);
        setLoading(false);
      })
      .catch(console.log);
  }
  useEffect(() => {
    getData();
  },[500]);
  if (loading) {
    return (
      
        <Flex align="center" justify="center">
          <CircularProgress isIndeterminate value={80} />
        </Flex>
    );
  }
  return (
    <Container maxW="xl" centerContent padding={0}>
      <DrawerComponent />
      <Map
        {...viewport}
        width="100vw"
        height="100vh"
        onViewportChange={setViewport}
        mapboxApiAccessToken={token}
        className="map"
      >
        {neighbor.map((item) => (
          <>
            <Marker
              className="marker"
              latitude={parseFloat(item.location.latitude)}
              longitude={parseFloat(item.location.longitude)}
              offsetLeft={-20}
              offsetTop={-10}
            >
              <Box
                as="button"
                onClick={() => handleMarkerClick(item.id)}
                borderRadius="md"
                bg="tomato"
                color="white"
                px={4}
                h={8}
              >
                {intlMonetary.format(item.average ? item.average : 0)}
              </Box>
            </Marker>
            {item.id === currentPlaceId && (
              <Popup
                latitude={parseFloat(item.location.latitude)}
                longitude={parseFloat(item.location.longitude)}
                closeButton={true}
                closeOnClick={true}
                onClose={() => setCurrentPlaceId("")}
                anchor="top"
                className="pop"
              >
                <CardPop
                  title={item.nome}
                  value={item.average ? item.average : 0}
                />
              </Popup>
            )}
          </>
        ))}
      </Map>
    </Container>
  );
}
