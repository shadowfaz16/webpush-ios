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
      <Flex gap={4} alignItems="center">
        <Image src="/w3hlogo.png" width={60} height={60} alt="logo" />
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
