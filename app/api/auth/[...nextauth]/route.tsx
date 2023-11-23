import {AuthOptions} from "next-auth";
import NextAuth from "next-auth/next";
import { authOptions } from "./auth";
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")

const handler = NextAuth(authOptions as AuthOptions);

export { handler as GET, handler as POST };
