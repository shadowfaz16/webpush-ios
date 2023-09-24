import { Flex, IconButton, useColorMode } from "@chakra-ui/react";
import React from "react";
import { Web3Button } from '@web3modal/react'
import { NavLink } from "./NavLink";
import { FaMoon, FaSun } from "react-icons/fa";
import Link from "next/link";

function Navbar() {

  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex alignItems="center" justifyContent={"space-between"} w="full" backgroundColor="section" borderBottom={'1px'} padding={4} position='sticky'>
      <Flex gap={4} alignItems="center">
        <NavLink href="/">Home</NavLink>
      </Flex>
      <Flex gap={4} alignItems="center" justifyContent={"center"}>
        <IconButton
          aria-label="toggle theme"
          size="md"
          rounded={"full"}
          onClick={toggleColorMode}
          icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
        />
        <Link href="/notifs">
          Notifs
        </Link>
        <Web3Button balance="hide" label="Connect Wallet" />
      </Flex>
    </Flex>
  );
}

export default Navbar;
