import { Flex, IconButton, useColorMode } from "@chakra-ui/react";
import React from "react";
import { Web3Button } from '@web3modal/react'
import { NavLink } from "./NavLink";
import { FaMoon, FaSun } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

function Navbar() {

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems="center" justifyContent={"space-between"} w="full" backgroundColor="section" padding={4} position='sticky'>


      <IconButton
        aria-label="toggle theme"
        size="md"
        rounded={"full"}
        onClick={toggleColorMode}
        icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
      />

      <Web3Button balance="hide" label="Connect Wallet" />

    </Flex>
  );
}

export default Navbar;
